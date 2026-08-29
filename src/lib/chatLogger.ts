import 'server-only';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase Client Initialization
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

// Only instantiate client if credentials exist in the environment
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
    : null;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChatLogEntry = {
  userMessage: string;
  assistantResponse: string;
  modelName: string;
  provider: string;
  conversationLength?: number;
};

// ---------------------------------------------------------------------------
// Logging Function
// ---------------------------------------------------------------------------

/**
 * Asynchronously writes a completed chat turn to the Supabase `chat_logs` table.
 * Wrapped in a safe try/catch block so database issues will never crash or interrupt
 * the user's active streaming response.
 */
export async function logChatToDatabase(entry: ChatLogEntry): Promise<void> {
  if (!supabase) {
    // Supabase credentials not configured in .env.local yet; skip quietly or log in dev
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '[ChatLogger] Supabase not configured in .env.local; skipping DB log.'
      );
    }
    return;
  }

  try {
    const { error } = await supabase.from('chat_logs').insert([
      {
        user_message: entry.userMessage,
        assistant_response: entry.assistantResponse,
        model_name: entry.modelName,
        provider: entry.provider,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('[ChatLogger] Failed to insert chat log into Supabase:', error.message);
    } else {
      console.log(`[ChatLogger] Successfully logged chat to Supabase (${entry.modelName})`);
    }
  } catch (err: any) {
    console.error('[ChatLogger] Unexpected error writing to database:', err?.message || err);
  }
}
