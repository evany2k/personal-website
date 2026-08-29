"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import {
  Send,
  Sparkles,
  RotateCcw,
  Square,
  Copy,
  Check,
  GraduationCap,
  Code2,
  FolderGit2,
  Mail,
  Bot,
  User,
  ArrowRight,
  Cpu,
  FileCode,
  X,
} from "lucide-react";
import { geminiModel } from "@/lib/models";
import { EVAN_PERSONA_PROMPT } from "@/lib/persona";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Custom metadata attached to assistant message chunks by our backend route.
 * Contains information about which LLM model actually processed the request.
 */
type ChatMessageMetadata = {
  model?: string;
  provider?: string;
};

// ---------------------------------------------------------------------------
// Constants: Suggested Starter Prompts
// ---------------------------------------------------------------------------

/**
 * Quick-start question cards displayed on the empty chat state.
 * Clicking any of these automatically submits the prompt to the assistant.
 */
const SUGGESTED_PROMPTS = [
  {
    icon: GraduationCap,
    title: "Background & Education",
    prompt: "Tell me about your transition from Environmental Science to Computer Science.",
  },
  {
    icon: FolderGit2,
    title: "Featured Projects",
    prompt: "What key software projects have you built recently and what tech stack did you use?",
  },
  {
    icon: Code2,
    title: "Technical Skills",
    prompt: "What are your core programming languages, frameworks, and technical strengths?",
  },
  {
    icon: Mail,
    title: "Connect & Contact",
    prompt: "How can I get in touch with you or collaborate on a software project?",
  },
];

// ---------------------------------------------------------------------------
// Helper: Extract Plain Text from UIMessage
// ---------------------------------------------------------------------------

/**
 * In AI SDK v7, messages contain a `parts` array (which can include text, tools, reasoning, etc.).
 * This helper filters for all text parts and joins them into a single string.
 */
function getMessageText(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

// ---------------------------------------------------------------------------
// Markdown Parser & Formatter Components
// ---------------------------------------------------------------------------

/**
 * Parses multiline Markdown text (code blocks ```, headers ###, unordered/ordered lists, paragraphs)
 * into styled React components matching the website's theme.
 */
function FormattedMessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];

  lines.forEach((line, index) => {
    // 1. Code Block Delimiter (```)
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Closing a code block: render collected lines inside <pre><code>
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-3 p-3 bg-stone-900 text-stone-100 rounded-lg text-xs md:text-sm font-mono overflow-x-auto border border-stone-800"
          >
            <code>{codeBlockBuffer.join("\n")}</code>
          </pre>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        // Opening a new code block
        inCodeBlock = true;
      }
      return;
    }

    // Accumulate lines while inside a code block
    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    // 2. Empty line spacer
    if (!trimmed) {
      elements.push(<div key={`spacer-${index}`} className="h-2" />);
      return;
    }

    // 3. Section Headers (### Heading)
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={`h4-${index}`} className="text-base font-bold text-stone-900 mt-3 mb-1">
          {renderInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      return;
    }

    // 4. Bullet Points and Numbered Lists (- item, * item, + item, 1. item)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("+ ") || /^\d+[\.\)]\s/.test(trimmed)) {
      const isOrdered = /^\d+[\.\)]\s/.test(trimmed);
      const cleanText = trimmed.replace(/^[-*+]\s+|\d+[\.\)]\s+/, "");
      elements.push(
        <div key={`li-${index}`} className="flex items-start gap-2 my-1 ml-1 text-stone-700">
          <span className="text-emerald-700 font-bold shrink-0 mt-1 select-none">
            {isOrdered ? trimmed.match(/^\d+[\.\)]/)?.[0] : "•"}
          </span>
          <span className="leading-relaxed">{renderInlineMarkdown(cleanText)}</span>
        </div>
      );
      return;
    }

    // 5. Standard Paragraphs
    elements.push(
      <p key={`p-${index}`} className="my-1.5 leading-relaxed text-stone-700">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  // Handle unclosed code block at end of content (e.g. while streaming)
  if (inCodeBlock && codeBlockBuffer.length > 0) {
    elements.push(
      <pre
        key="code-end"
        className="my-3 p-3 bg-stone-900 text-stone-100 rounded-lg text-xs md:text-sm font-mono overflow-x-auto border border-stone-800"
      >
        <code>{codeBlockBuffer.join("\n")}</code>
      </pre>
    );
  }

  return <div className="space-y-1 text-sm md:text-[15px]">{elements}</div>;
}

// ---------------------------------------------------------------------------
// Helper: Format readable link labels for internal routes
// ---------------------------------------------------------------------------
function formatLinkLabel(label: string): string {
  const trimmed = label.trim();
  if (trimmed === "/projects") return "Projects";
  if (trimmed === "/resume") return "Resume";
  if (trimmed === "/about") return "About";
  if (trimmed === "/chat") return "Chat";
  if (trimmed.startsWith("/") && trimmed.length > 1) {
    return trimmed.slice(1).charAt(0).toUpperCase() + trimmed.slice(2);
  }
  return trimmed;
}

/**
 * Parses inline Markdown tokens:
 * - ***bold italic*** -> <strong><em>
 * - **bold text** -> <strong>
 * - *italic text* -> <em>
 * - `inline code` -> <code>
 * - ~~strikethrough~~ -> <del>
 * - [Link Label](url) / [Link Label] (url) -> Next.js <Link> (for internal routes) or <a> (for external URLs)
 * - Raw URLs (https://...) -> <a>
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  // Regex to split by markdown formatting tokens and raw URLs while preserving delimiters in the array
  const tokenRegex =
    /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*[^*\n]+?\*|`.*?`|~~.*?~~|\[[^\]]+\]\s*\([^\)]+\)|https?:\/\/[^\s\)<>]+)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // 1. Bold + Italic (***word***)
    if (part.startsWith("***") && part.endsWith("***") && part.length >= 6) {
      return (
        <strong key={i} className="font-semibold text-stone-900">
          <em className="italic">{part.slice(3, -3)}</em>
        </strong>
      );
    }

    // 2. Bold text (**word**)
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-stone-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 3. Italic text (*word*)
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="italic text-stone-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // 4. Strikethrough (~~word~~)
    if (part.startsWith("~~") && part.endsWith("~~") && part.length >= 4) {
      return (
        <del key={i} className="line-through text-stone-400">
          {part.slice(2, -2)}
        </del>
      );
    }

    // 5. Inline code (`code`)
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 bg-stone-100 text-emerald-900 border border-stone-200 rounded font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // 6. Markdown Links ([label](url) or [label] (url))
    const linkMatch = part.match(/^\[([^\]]+)\]\s*\(([^\)]+)\)$/);
    if (linkMatch) {
      const rawLabel = linkMatch[1];
      const url = linkMatch[2].trim();
      const displayLabel = formatLinkLabel(rawLabel);
      const isInternal = url.startsWith("/");

      // Use Next.js Link for client-side routing if it's an internal route (e.g. /projects)
      if (isInternal) {
        return (
          <Link
            key={i}
            href={url}
            className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2 font-medium"
          >
            {displayLabel}
          </Link>
        );
      }
      // External links open in a new tab
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2 font-medium"
        >
          {displayLabel}
        </a>
      );
    }

    // 7. Raw URLs (e.g. https://github.com/evany2k)
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2 font-medium break-all"
        >
          {part}
        </a>
      );
    }

    // 8. Plain text
    return part;
  });
}

// ---------------------------------------------------------------------------
// Main Component: ChatPage
// ---------------------------------------------------------------------------

export default function ChatPage() {
  // Local state for user input and copy confirmation animations
  const [inputMessage, setInputMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  // DOM Refs for auto-scrolling and focusing the textarea
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Vercel AI SDK React Hook:
   * Handles message history, real-time streaming, API requests to /api/chat,
   * error states, and aborting/regenerating responses.
   */
  const {
    messages,
    setMessages,
    sendMessage,
    regenerate,
    stop,
    status,
    error,
    clearError,
  } = useChat();

  // Flag indicating if the AI is actively preparing or streaming a response
  const isGenerating = status === "submitted" || status === "streaming";

  // Find the latest assistant message to display dynamic model metadata in the header badge
  const latestAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  const latestMetadata = latestAssistantMessage?.metadata as ChatMessageMetadata | undefined;


  // Keyboard shortcut: Close the System Prompt modal when the user presses 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPromptModalOpen) {
        setIsPromptModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPromptModalOpen]);

  // Auto-scroll to the bottom of the chat when new messages arrive or while streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  /**
   * Submits a message to the AI route.
   * Can be triggered by the send button, Enter key, or clicking a suggested prompt card.
   */
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isGenerating) return;

    setInputMessage("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    clearError();
    await sendMessage({ text: query });
  };

  /**
   * Allows pressing Enter to send a message, while Shift+Enter creates a new line.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Auto-resize the textarea as content changes, resetting height to auto first
   * to allow shrinking, then setting it to the actual scrollHeight.
   */
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputMessage(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    []
  );

  /**
   * Copies an individual message's text to the clipboard and shows a temporary checkmark.
   */
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * Copies the entire system prompt to the clipboard inside the modal.
   */
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(EVAN_PERSONA_PROMPT.trim());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  /**
   * Resets the conversation and stops any active generation.
   */
  const handleResetChat = () => {
    if (isGenerating) {
      stop();
    }
    setMessages([]);
    clearError();
  };

  return (
    <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6 md:py-10">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Header Section: Avatar, Status Badge, and Header Action Buttons */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3.5">
          {/* Avatar with live green pulse indicator */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-700 to-stone-800 flex items-center justify-center text-white shadow-md">
              <Bot size={24} className="text-emerald-100" />
            </div>
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#F9F8F6] rounded-full"
              title="Online"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
                Evan's AI
              </h1>

              {/* Dynamic Model Status Badge: Shows the model that processed the latest response */}
              {latestMetadata?.model ? (
                <span className="px-2.5 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {latestMetadata.model}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-600 rounded-full border border-stone-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Powered by {geminiModel} through Google AI Studio API
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Ask questions about my education, projects, skills, or background.
            </p>
          </div>
        </div>

        {/* Action Buttons: Open System Prompt Modal & Reset Chat */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Button to inspect the full persona/context */}
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            title="View the full system prompt and grounding context"
          >
            <FileCode size={14} className="text-emerald-700" />
            <span>View the Full System Prompt</span>
          </button>

          {/* New Chat Reset Button (visible after conversation begins) */}
          {messages.length > 0 && (
            <button
              onClick={handleResetChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Main Chat Area: Empty State vs Message Feed                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col py-6 space-y-6 min-h-[450px]">
        {messages.length === 0 ? (
          /* Empty State: Displays prompt suggestions if no conversation has started */
          <div className="flex-1 flex flex-col justify-center items-center text-center my-auto py-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 mb-4 shadow-sm">
              <Sparkles size={28} />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">
              What would you like to know about Evan?
            </h2>
            <p className="text-sm text-stone-500 max-w-md mb-8">
              Click any suggested topic below or type your custom question to begin conversing with the AI assistant.
            </p>

            {/* 2x2 Grid of Starter Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              {SUGGESTED_PROMPTS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="p-4 bg-white hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow group text-left flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-emerald-100 text-stone-700 group-hover:text-emerald-800 transition-colors">
                        <IconComponent size={18} />
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-stone-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-stone-800 leading-snug">
                        "{item.prompt}"
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Feed: Renders conversation message bubbles */
          <div className="space-y-6">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const textContent = getMessageText(message);
              const metadata = message.metadata as ChatMessageMetadata | undefined;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Sender Avatar (User icon vs Bot icon) */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${isUser
                      ? "bg-stone-800 text-white"
                      : "bg-emerald-800 text-emerald-100"
                      }`}
                  >
                    {isUser ? <User size={15} /> : <Bot size={16} />}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${isUser
                      ? "bg-emerald-800 text-white rounded-tr-none"
                      : "bg-white border border-stone-200 rounded-tl-none"
                      }`}
                  >
                    {isUser ? (
                      /* User Message: Plain text with whitespace preserved */
                      <p className="text-sm md:text-[15px] whitespace-pre-wrap leading-relaxed text-white">
                        {textContent}
                      </p>
                    ) : (
                      /* Assistant Message: Render formatted Markdown */
                      <>
                        <FormattedMessageContent content={textContent} />

                        {/* Metadata Footer: Displays which LLM model processed the response */}
                        {metadata?.model && (
                          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                            <div className="flex items-center gap-1.5">
                              <Cpu size={12} className="text-emerald-700" />
                              <span>
                                Processed by{" "}
                                <strong className="text-stone-700 font-semibold">
                                  {metadata.model}
                                </strong>
                              </span>
                            </div>
                            {metadata.provider && (
                              <span className="text-[10px] font-medium text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200/60">
                                {metadata.provider}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Copy Response Button (appears on hover) */}
                        <button
                          onClick={() => handleCopy(message.id, textContent)}
                          className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-stone-700 bg-white/80 hover:bg-stone-100 rounded-md border border-stone-200/60 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check size={13} className="text-emerald-700" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Streaming Indicator: Displayed while AI response is being generated */}
            {isGenerating && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="text-xs text-stone-500 font-medium ml-1.5">
                    Evan's avatar is thinking...
                  </span>
                </div>
              </div>
            )}

            {/* Error Message Box: Displayed if connection or API fails */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>
                  {error.message || "An error occurred while connecting to the chat service."}
                </span>
                <button
                  onClick={() => regenerate()}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold self-start sm:self-auto cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Invisible anchor element to scroll down into view */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Input Footer: Expanding Textarea & Send/Stop Buttons            */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky bottom-4 z-20 pt-2">
        <div className="bg-white border border-stone-300 rounded-2xl shadow-lg p-2 transition-all focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about my projects, education, or experience..."
              className="flex-1 max-h-32 min-h-[44px] p-2.5 bg-transparent text-sm md:text-[15px] text-stone-800 placeholder-stone-400 focus:outline-none resize-none overflow-hidden"
            />

            {/* If generating, render 'Stop' button; otherwise render 'Send' button */}
            {isGenerating ? (
              <button
                type="button"
                onClick={() => stop()}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-all active:scale-95 shadow-sm flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Stop generation"
              >
                <Square size={14} className="fill-white" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white rounded-xl transition-all active:scale-95 shadow-sm disabled:cursor-not-allowed cursor-pointer"
                title="Send message"
              >
                <Send size={16} />
              </button>
            )}
          </form>
        </div>

        <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-stone-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by Gemini & OpenRouter</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Modal: Full System Prompt & Grounding Context Viewer            */}
      {/* ------------------------------------------------------------------ */}
      {isPromptModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prompt-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsPromptModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#F9F8F6] border border-stone-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <FileCode size={18} />
                </div>
                <div>
                  <h3 id="prompt-modal-title" className="text-base font-bold text-stone-900">
                    AI System Prompt & Grounding Context
                  </h3>
                  <p className="text-xs text-stone-500">
                    The exact instructions and background data sent with each LLM request.
                  </p>
                </div>
              </div>

              {/* Copy prompt button and modal close X button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                  title="Copy system prompt"
                >
                  {copiedPrompt ? (
                    <>
                      <Check size={13} className="text-emerald-700" />
                      <span className="text-emerald-700 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsPromptModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable code viewer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 leading-relaxed">
                💡 <strong>Grounding Context:</strong> This system prompt instructs the LLM on Evan's background, education, projects, skills, and communication guidelines, ensuring accurate and helpful answers.
              </div>

              <div className="relative">
                <pre className="p-4 bg-stone-900 text-stone-100 rounded-xl text-xs md:text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto border border-stone-800 shadow-inner">
                  <code>{EVAN_PERSONA_PROMPT.trim()}</code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-stone-200 bg-white text-xs text-stone-500">
              <span>
                Source: <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">src/lib/persona.ts</code>
              </span>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}