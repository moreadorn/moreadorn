import { useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  Package,
  Globe2,
  FileText,
} from "lucide-react";
import {
  fetchAiSettings,
  sendChatMessage,
  type ChatTurn,
} from "../api/aiSettings";
import { AiAvatar } from "./AiAvatar";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const DEFAULT_NAME = "Aria";
const DEFAULT_WELCOME =
  "Hi 👋  I'm Aria — Moreadorn's trade assistant. Ask me about our products, shipping destinations, or how to request a quote.";

function todayLabel(): string {
  const d = new Date();
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [assistantName, setAssistantName] = useState(DEFAULT_NAME);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      from: "bot",
      text: DEFAULT_WELCOME,
      time: now(),
    },
  ]);

  // Load the configured assistant name + welcome message once.
  useEffect(() => {
    let cancelled = false;
    fetchAiSettings()
      .then((s) => {
        if (cancelled) return;
        setAssistantName(s.assistant_name || DEFAULT_NAME);
        setMessages((prev) =>
          prev.length === 1 && prev[0].id === "welcome"
            ? [
                {
                  id: "welcome",
                  from: "bot",
                  text: s.welcome_message || DEFAULT_WELCOME,
                  time: now(),
                },
              ]
            : prev,
        );
      })
      .catch(() => {
        /* silent — defaults stay */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages, typing]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleToggle = () => {
    setOpen((v) => !v);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: Message = {
      id: String(Date.now()),
      from: "user",
      text,
      time: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    // Build the running history so Gemini has conversational context.
    const history: ChatTurn[] = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.from === "user" ? "user" : "model",
        text: m.text,
      }));

    try {
      const res = await sendChatMessage(text, history);
      const replyText =
        res.reply ||
        res.error ||
        "I'm having trouble forming a response right now. Please try again.";
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          from: "bot",
          text: replyText,
          time: now(),
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          from: "bot",
          text:
            err instanceof Error
              ? err.message
              : "Couldn't reach the assistant. Please try again shortly.",
          time: now(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts: {
    text: string;
    icon: typeof Package;
    accent: string;
  }[] = [
    {
      text: "What products do you export?",
      icon: Package,
      accent: "bg-amber-50 text-amber-700",
    },
    {
      text: "Which countries do you ship to?",
      icon: Globe2,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      text: "How do I request a quote?",
      icon: FileText,
      accent: "bg-indigo-50 text-indigo-700",
    },
  ];

  const showWelcomeHero = messages.length <= 1 && !typing;

  return (
    <>
      {/* ============== FLOATING TRIGGER — gold "Chat with Aria" pill with effective AI-bot icon ============== */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={open ? "Close chat" : `Open chat with ${assistantName}`}
        className={`fixed bottom-6 right-6 z-[60] group transition-all duration-300 ease-out ${
          open
            ? "scale-90 opacity-0 pointer-events-none"
            : "scale-100 opacity-100"
        }`}
      >
        {/* Outer pulsing ring — sonar ping */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#C8A96A]/80 pointer-events-none"
          style={{ animation: "chatbot-ping 2.6s ease-out infinite" }}
        />

        {/* Wide soft halo — blinks visibly gold behind the pill */}
        <span
          aria-hidden="true"
          className="absolute -inset-5 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(200,169,106,0.95) 0%, rgba(200,169,106,0.55) 45%, rgba(200,169,106,0) 75%)",
            filter: "blur(18px)",
            animation: "chatbot-glow 2.2s ease-in-out infinite",
          }}
        />

        {/* Tight inner core — concentrated gold along the pill edge */}
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full pointer-events-none bg-[#C8A96A]/70 blur-md"
          style={{ animation: "chatbot-glow 2.2s ease-in-out infinite" }}
        />

        {/* The pill itself — gently breathes (scale + brightness) */}
        <span
          className="relative inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full text-[#0B0B0B] font-bold text-[13px] tracking-[0.06em] shadow-[0_14px_32px_-10px_rgba(200,169,106,0.65)] group-hover:shadow-[0_18px_40px_-10px_rgba(200,169,106,0.95)] group-hover:-translate-y-0.5 transition-all"
          style={{
            background:
              "linear-gradient(135deg, #C8A96A 0%, #E6D3A3 50%, #C8A96A 100%)",
            animation: "chatbot-breathe 2.6s ease-in-out infinite",
          }}
        >
          {/*
            AI-bot icon block — the bitmoji fully covers a 48px round area
            on the gold pill. No outer ring, no badges; just a small
            blinking green online-pip at the bottom-right.
          */}
          <span className="relative flex-shrink-0 w-12 h-12">
            {/* The bitmoji — slightly oversized + centred so it fully
                covers the circle with no visible inner padding */}
            <span className="relative flex w-12 h-12 items-center justify-center overflow-hidden rounded-full">
              <span
                className="block"
                style={{ animation: "chatbot-bob 2.6s ease-in-out infinite" }}
              >
                <span className="block transition-transform duration-500 ease-out group-hover:-rotate-[8deg] group-hover:scale-[1.08]">
                  <AiAvatar
                    seed={assistantName}
                    size={56}
                    variant="plain"
                  />
                </span>
              </span>
            </span>

            {/* Small blinking online pip — bottom-right */}
            <span
              aria-hidden="true"
              className="absolute -bottom-0 -right-0 w-2 h-2 rounded-full bg-emerald-500 ring-[1.5px] ring-white shadow-[0_0_6px_rgba(16,185,129,0.9)]"
              style={{ animation: "chatbot-pip-blink 1.6s ease-in-out infinite" }}
            />
          </span>

          <span className="whitespace-nowrap">
            Chat with {assistantName}
          </span>
        </span>
      </button>

      <style>{`
        @keyframes chatbot-msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatbot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes chatbot-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes chatbot-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes chatbot-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }
        @keyframes chatbot-sheen {
          0%   { transform: translateX(-110%); }
          55%  { transform: translateX(110%); }
          100% { transform: translateX(110%); }
        }

        /* === Floating CTA pulse / blink === */
        @keyframes chatbot-ping {
          0%   { transform: scale(1);    opacity: 0.55; }
          70%  { transform: scale(1.35); opacity: 0;    }
          100% { transform: scale(1.35); opacity: 0;    }
        }
        @keyframes chatbot-glow {
          0%, 100% { opacity: 0.7; transform: scale(0.96); }
          50%      { opacity: 1;   transform: scale(1.10); }
        }
        @keyframes chatbot-breathe {
          0%, 100% { transform: scale(1);    filter: brightness(1);    }
          50%      { transform: scale(1.03); filter: brightness(1.08); }
        }
        @keyframes chatbot-blink {
          0%, 45%, 55%, 100% { opacity: 1;    }
          50%                 { opacity: 0.55; }
        }
        /* Continuous gentle bob for the floating bitmoji */
        @keyframes chatbot-bob {
          0%, 100% { transform: translateY(0)     rotate(0deg);   }
          25%      { transform: translateY(-2.5px) rotate(-2deg); }
          75%      { transform: translateY(-1px)   rotate(2deg);  }
        }
        /* Online indicator blink — quick on/off rhythm */
        @keyframes chatbot-pip-blink {
          0%, 100%   { opacity: 1;   transform: scale(1);    }
          45%, 55%   { opacity: 0.2; transform: scale(0.85); }
        }
      `}</style>

      {/* ============== BACKDROP ============== */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[59] bg-[#0B0B0B]/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ============== CHAT PANEL — full-height drawer from the right ============== */}
      <aside
        aria-hidden={!open}
        className={`fixed top-0 bottom-0 right-0 z-[60] w-full sm:w-[440px] flex flex-col bg-white shadow-[-24px_0_60px_-12px_rgba(11,11,11,0.25)] transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ============== TOP HEADER — full identity row ============== */}
        <div className="relative flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] bg-white">
          {/* Soft halo behind the avatar */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 bg-[#C8A96A]/15 rounded-full blur-2xl pointer-events-none"
          />

          <div className="relative flex-shrink-0">
            <AiAvatar seed={assistantName} size={40} />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${typing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-semibold text-[#0B0B0B] tracking-tight truncate">
                {assistantName}
              </h3>
              <span className="inline-flex items-center gap-0.5 text-[9px] tracking-[0.2em] uppercase text-[#C8A96A] font-bold">
                <Sparkles size={9} /> AI
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">
              {typing ? "Typing…" : "Online · Trained on Moreadorn's products & markets"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="w-8 h-8 rounded-full hover:bg-black/[0.05] flex items-center justify-center text-gray-500 hover:text-[#0B0B0B] transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>

          {/* Gold accent line + animated shimmer at the bottom edge */}
          <span className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#C8A96A]/40 to-transparent" />
          <span className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
            <span
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent"
              style={{ animation: "chatbot-shimmer 4s ease-in-out infinite" }}
            />
          </span>
        </div>

        {/* Hero — only on first open, before any user message */}
        {showWelcomeHero ? (
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#FAF8F3] via-white to-[#FAFAF8]">
            <div className="px-6 pt-10 pb-6 text-center">
              {/* gradient halo around avatar */}
              <div className="relative mx-auto w-[120px] h-[120px] mb-5">
                <span
                  className="absolute -inset-3 rounded-full opacity-90 blur-md"
                  style={{
                    background:
                      "conic-gradient(from 90deg, #C8A96A 0%, #FF7AB6 35%, #7AC8FF 70%, #C8A96A 100%)",
                  }}
                />
                <span
                  className="relative block w-[120px] h-[120px] rounded-full bg-white p-[3px] overflow-hidden"
                  style={{ animation: "chatbot-float 3.6s ease-in-out infinite" }}
                >
                  <AiAvatar
                    seed={assistantName}
                    size={114}
                    variant="plain"
                  />
                  {/* live pip */}
                  <span className="absolute bottom-1.5 right-2 w-4 h-4 rounded-full bg-emerald-500 ring-[3px] ring-white" />
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] text-[10px] tracking-[0.18em] uppercase font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </div>

              <h2 className="text-[26px] font-bold text-[#0B0B0B] tracking-tight leading-tight">
                Hi, I'm {assistantName}
              </h2>
              <p className="mt-2 text-[14px] text-gray-500 leading-relaxed max-w-[300px] mx-auto">
                {messages[0]?.text || DEFAULT_WELCOME}
              </p>
            </div>

            {/* Suggested as full-width concierge cards */}
            <div className="px-5 pb-6">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gray-400 font-bold mb-3 px-1">
                Quick start
              </p>
              <div className="space-y-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => {
                      setInput(p.text);
                      inputRef.current?.focus();
                    }}
                    className="group w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl bg-white border border-black/[0.06] hover:border-[#0B0B0B] hover:shadow-md transition-all"
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.accent}`}
                    >
                      <p.icon size={17} strokeWidth={2} />
                    </span>
                    <span className="text-[14px] text-[#0B0B0B] flex-1 font-medium">
                      {p.text}
                    </span>
                    <span className="text-gray-300 group-hover:text-[#0B0B0B] group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </button>
                ))}
              </div>

              {/* Trust strip */}
              <div className="mt-5 px-4 py-3 rounded-2xl bg-[#0B0B0B] text-white">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8A96A]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-[#C8A96A]" />
                  </div>
                  <div className="text-[11.5px] leading-relaxed text-gray-300">
                    {assistantName} only answers questions about Moreadorn —
                    products, markets, blog, shipping, and quotes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============== MESSAGE LIST ============== */
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#FAFAF8]"
          >
            {/* Date divider — single line, quiet */}
            <div className="flex items-center gap-2 mb-2">
              <span className="flex-1 h-px bg-black/[0.05]" />
              <span className="text-[10px] tracking-[0.18em] uppercase text-gray-400 font-semibold px-1">
                {todayLabel()}
              </span>
              <span className="flex-1 h-px bg-black/[0.05]" />
            </div>

            {messages.map((msg) =>
              msg.from === "bot" ? (
                <div
                  key={msg.id}
                  className="group flex items-start gap-2.5 max-w-[90%]"
                  style={{ animation: "chatbot-msg-in 240ms ease-out both" }}
                >
                  <div className="flex-shrink-0">
                    <AiAvatar seed={assistantName} size={28} />
                  </div>
                  <div className="min-w-0 relative">
                    {/* No card — just inline text with the assistant name above it */}
                    <div className="text-[10px] tracking-wide text-[#C8A96A] font-bold mb-1">
                      {assistantName}
                    </div>
                    <p className="text-[14px] text-[#0B0B0B] leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-gray-400">
                        {msg.time}
                      </span>
                      {msg.id !== "welcome" && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          aria-label="Copy message"
                          className="text-[10px] text-gray-400 hover:text-[#0B0B0B] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={10} className="text-emerald-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={10} />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={msg.id}
                  className="flex flex-col items-end max-w-[88%] ml-auto"
                  style={{ animation: "chatbot-msg-in 240ms ease-out both" }}
                >
                  <div className="bg-gradient-to-br from-[#0B0B0B] to-[#2a2a2a] text-white rounded-[20px] rounded-br-sm px-4 py-2.5 shadow-sm">
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 mr-1 mt-1">
                    {msg.time}
                  </span>
                </div>
              ),
            )}

            {/* typing indicator */}
            {typing && (
              <div
                className="flex items-start gap-2.5"
                style={{ animation: "chatbot-msg-in 240ms ease-out both" }}
              >
                <AiAvatar seed={assistantName} size={28} />
                <div className="pt-1">
                  <div className="text-[10px] tracking-wide text-[#C8A96A] font-bold mb-1.5">
                    {assistantName}
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#C8A96A] animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============== INPUT BAR — pill style at the bottom ============== */}
        <div className="px-4 pb-5 pt-3 bg-white border-t border-black/[0.05]">
          <div className="flex items-end gap-2 bg-[#F5F1E8] border border-black/[0.06] focus-within:border-[#0B0B0B] rounded-full pl-5 pr-1.5 py-1.5 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${assistantName} anything…`}
              className="flex-1 resize-none bg-transparent text-[14px] text-[#0B0B0B] placeholder:text-gray-400 focus:outline-none py-2 max-h-28 leading-relaxed"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="w-10 h-10 rounded-full bg-[#0B0B0B] text-white flex items-center justify-center hover:bg-[#1a1a1a] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={15} strokeWidth={2.2} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </aside>
    </>
  );
}
