import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStream,
  createUIMessageStreamResponse,
  UIMessage,
  UIMessageStreamWriter,
} from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { EVAN_PERSONA_PROMPT } from '@/lib/persona';
import { logChatToDatabase } from '@/lib/chatLogger';
import { checkRateLimit } from '@/lib/rateLimit';
import { after } from 'next/server';
import { headers } from 'next/headers';
import { geminiModel, fallbackGeminiModel, openRouterModel } from '@/lib/models';
import { siteConfig } from '@/data/siteConfig';

export const maxDuration = 45;

/**
 * Reusable helper to attempt streaming from a given LLM model.
 * If the model throws an exception OR yields an error chunk before text is produced (e.g. 404 model not found, 429 quota),
 * it returns false so the caller can cleanly fall back to the next candidate model.
 */
async function tryStreamModel({
  model,
  modelName,
  providerName,
  messages,
  writer,
}: {
  model: Parameters<typeof streamText>[0]['model'];
  modelName: string;
  providerName: string;
  messages: Awaited<ReturnType<typeof convertToModelMessages>>;
  writer: UIMessageStreamWriter;
}): Promise<boolean> {
  console.log(`[Chat Pipeline] Attempting generation with model: ${modelName} (${providerName})...`);
  try {
    // Extract the latest user query from the message history for logging
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const userPromptText =
      typeof lastUserMessage?.content === 'string'
        ? lastUserMessage.content
        : Array.isArray(lastUserMessage?.content)
          ? lastUserMessage.content
            .map((c) => ('text' in c ? c.text : ''))
            .join(' ')
          : 'User query';

    const result = streamText({
      model,
      messages,
      instructions: EVAN_PERSONA_PROMPT,
      onEnd: ({ text }) => {
        // Guarantee background DB insertion in serverless environments
        after(async () => {
          await logChatToDatabase({
            userMessage: userPromptText,
            assistantResponse: text,
            modelName,
            provider: providerName,
            conversationLength: messages.length,
          });
        });
      },
    });

    const uiStream = toUIMessageStream({
      stream: result.stream,
      messageMetadata: () => ({
        model: modelName,
        provider: providerName,
      }),
    });

    const reader = uiStream.getReader();
    let hasStreamedText = false;
    const initialBufferedChunks: any[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Check if provider returned an error chunk before any text was generated
      if (value.type === 'error') {
        console.warn(
          `Model ${modelName} (${providerName}) yielded error chunk:`,
          value.errorText
        );
        if (!hasStreamedText) {
          // Fail early without sending broken error chunks to the client so fallback model can take over
          return false;
        }
      }

      if (value.type === 'text-delta' && value.delta) {
        hasStreamedText = true;
      }

      // If we haven't confirmed text yet and this is a start/metadata chunk, buffer it
      if (!hasStreamedText && (value.type === 'start' || value.type === 'message-metadata')) {
        initialBufferedChunks.push(value);
        continue;
      }

      // Once first text arrives, flush buffered start chunks if any
      if (initialBufferedChunks.length > 0) {
        for (const chunk of initialBufferedChunks) {
          writer.write(chunk);
        }
        initialBufferedChunks.length = 0;
      }

      writer.write(value);
    }

    return hasStreamedText;
  } catch (error: any) {
    console.warn(
      `Stream attempt failed for ${modelName} (${providerName}):`,
      error?.message || error
    );
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // --- Rate Limiting ---
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      'unknown';
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.ceil(rateLimitResult.retryAfterMs / 1000);
      return new Response(
        JSON.stringify({
          error: `Too many requests. Please wait ${retryAfterSeconds} seconds before sending another message.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }

    const { messages } = (await req.json()) as { messages?: UIMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided in request payload.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const modelMessages = await convertToModelMessages(messages);

    const googleKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    // If neither key is configured, stream a friendly setup guidance message
    if (!googleKey && !openRouterKey) {
      return createUIMessageStreamResponse({
        stream: createUIMessageStream({
          execute: ({ writer }) => {
            const id = 'setup-msg';
            writer.write({
              type: 'message-metadata',
              messageMetadata: {
                model: 'Setup Mode',
                provider: 'System',
              },
            });
            writer.write({ type: 'text-start', id });
            writer.write({
              type: 'text-delta',
              id,
              delta:
                "👋 Hi! I'm Evan's AI Avatar. The chatbot is currently unavailable. \n\nIn the meantime, feel free to browse the [/about](/about), [/resume](/resume), and [/projects](/projects) pages to learn all about Evan's work!",
            });
            writer.write({ type: 'text-end', id });
          },
        }),
      });
    }

    const openrouter = openRouterKey
      ? createOpenRouter({ apiKey: openRouterKey })
      : null;

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Priority list of fallback candidates
        const candidates = [
          // 1. Primary Google Gemini model
          googleKey && geminiModel
            ? {
              model: google(geminiModel),
              modelName: geminiModel,
              providerName: 'Google Gemini',
            }
            : null,

          // 2. Secondary Google Gemini / Gemma fallback model
          googleKey && fallbackGeminiModel
            ? {
              model: google(fallbackGeminiModel),
              modelName: fallbackGeminiModel,
              providerName: 'Google Gemini',
            }
            : null,

          // 3. Tertiary OpenRouter fallback model
          openrouter && openRouterModel
            ? {
              model: openrouter(openRouterModel),
              modelName: openRouterModel,
              providerName: 'OpenRouter Free',
            }
            : null,
        ].filter(Boolean) as Array<{
          model: Parameters<typeof streamText>[0]['model'];
          modelName: string;
          providerName: string;
        }>;

        // Try candidates in order; stop at the first successful stream
        for (const candidate of candidates) {
          const succeeded = await tryStreamModel({
            model: candidate.model,
            modelName: candidate.modelName,
            providerName: candidate.providerName,
            messages: modelMessages,
            writer,
          });

          if (succeeded) {
            return;
          }
        }

        // 4. Failure scenario if all candidate models failed
        const id = 'error-msg';
        writer.write({
          type: 'message-metadata',
          messageMetadata: {
            model: 'Connection Notice',
            provider: 'System',
          },
        });
        writer.write({ type: 'text-start', id });
        writer.write({
          type: 'text-delta',
          id,
          delta:
            `I'm currently unable to reach the AI language services due to a temporary network or rate limit issue. Feel free to ask again in a moment, or contact Evan directly at [${siteConfig.email}](mailto:${siteConfig.email}).`,
        });
        writer.write({ type: 'text-end', id });
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error: any) {
    console.error('Unhandled chat route error:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'An unexpected error occurred in the chat service.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
