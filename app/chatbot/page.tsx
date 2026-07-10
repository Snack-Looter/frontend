"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ApiError, login, sendChatMessage } from "@/lib/api";
import { getAccessToken, saveTokens } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/Card";
import { FieldInput } from "@/components/ui/FieldInput";
import { PushButton } from "@/components/ui/PushButton";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const SUGGESTIONS = [
  { icon: "campaign", text: "Gimana cara promosi produk koperasi?" },
  { icon: "trending_up", text: "Kasih tips jualan buat pemula dong" },
  { icon: "lightbulb", text: "Ide konten promosi yang menarik apa?" },
  { icon: "flag", text: "Strategi capai target misi minggu ini?" },
];

export default function ChatbotPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthed(!!getAccessToken());
    setCheckedAuth(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const tokens = await login(email, password);
      saveTokens(tokens);
      setIsAuthed(true);
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Gagal login. Coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  }

  // `override` dipakai suggestion chip supaya bisa langsung kirim tanpa
  // menunggu state `input` ter-update dulu.
  async function handleSend(override?: string) {
    const text = (override ?? input).trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);
    setChatError(null);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setIsAuthed(false);
        setChatError("Sesi berakhir, silakan login lagi.");
      } else {
        setChatError(err instanceof ApiError ? err.message : "Gagal menghubungi chatbot.");
      }
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setMessages([]);
    setChatError(null);
    setInput("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="bg-surface text-ink font-body text-body h-screen flex flex-col overflow-hidden">
      <AppHeader />

      {/* Area di antara header dan bottom nav — tinggi tetap, scroll di dalam */}
      <div className="flex-1 flex flex-col pt-16 pb-24 overflow-hidden max-w-app mx-auto w-full">
        {!checkedAuth ? null : !isAuthed ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center px-md">
            <LoginGate
              email={email}
              password={password}
              loading={loginLoading}
              error={loginError}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
            />
          </div>
        ) : (
          <>
            <ChatIdentityBar onReset={handleReset} canReset={messages.length > 0} />

            <div className="flex-1 overflow-y-auto px-md">
              {messages.length === 0 ? (
                <EmptyState onPick={(t) => handleSend(t)} />
              ) : (
                <div className="flex flex-col gap-4 py-5">
                  {messages.map((m, i) => (
                    <MessageBubble key={i} message={m} />
                  ))}
                  {sending && <TypingBubble />}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>

            {/* Message Input Area — bagian dari flex flow, bukan fixed, jadi
                tingginya otomatis menyesuaikan (multi-baris, pesan error) tanpa
                pernah menutupi bubble chat di atasnya. */}
            <div className="flex-shrink-0 px-md pt-2">
              <div className="flex flex-col gap-2">
                {chatError && (
                  <p className="font-body text-label text-danger px-2 flex items-center gap-1">
                    <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
                      error
                    </span>
                    {chatError}
                  </p>
                )}
                <div className="flex items-end gap-2 bg-surface-card border-2.5 border-border-soft focus-within:border-primary rounded-button shadow-solid-sm p-2 transition-colors">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none resize-none font-body text-body text-ink placeholder-neutral min-h-[48px] max-h-32 py-3 px-2"
                    placeholder="Tulis pertanyaanmu..."
                    rows={1}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={sending || !input.trim()}
                    aria-label="Kirim pesan"
                    className="bg-primary text-white w-12 h-12 rounded-full border-2.5 border-ink flex items-center justify-center shadow-press-primary active:translate-y-1 active:shadow-none transition-all duration-100 flex-shrink-0 mb-0.5 disabled:bg-surface-sunken disabled:text-neutral disabled:border-border-soft disabled:shadow-none"
                  >
                    <span
                      className="material-symbols-rounded"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      send
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// Avatar bot dipakai di identity bar, bubble, dan typing indicator.
function BotAvatar({ size = 32, ring = false }: { size?: number; ring?: boolean }) {
  return (
    <span
      className={`rounded-full bg-primary text-white border-2 border-ink flex items-center justify-center flex-shrink-0 ${
        ring ? "shadow-press-primary" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <span
        className="material-symbols-rounded"
        style={{ fontVariationSettings: "'FILL' 1", fontSize: Math.round(size * 0.56) }}
      >
        smart_toy
      </span>
    </span>
  );
}

function ChatIdentityBar({ onReset, canReset }: { onReset: () => void; canReset: boolean }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-md py-3 border-b-2 border-border-soft bg-surface">
      <span className="relative">
        <BotAvatar size={44} ring />
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-surface" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display text-title-sm text-ink leading-tight">Asisten Misi AI</p>
        <p className="font-body text-caption text-secondary-dark font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          Online · siap bantu misimu
        </p>
      </div>
      {canReset && (
        <button
          type="button"
          onClick={onReset}
          aria-label="Mulai obrolan baru"
          className="w-10 h-10 rounded-full border-2 border-border-soft text-ink-soft flex items-center justify-center hover:border-primary hover:text-primary active:scale-90 transition-all duration-100 flex-shrink-0"
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
            edit_square
          </span>
        </button>
      )}
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center py-8">
      <span className="w-24 h-24 rounded-full bg-primary text-white border-3 border-ink shadow-solid-lg flex items-center justify-center animate-bounce-in">
        <span
          className="material-symbols-rounded"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: 52 }}
        >
          smart_toy
        </span>
      </span>
      <h2 className="font-display text-title text-ink mt-5">Halo! Aku asistenmu 🤖</h2>
      <p className="font-body text-body text-ink-soft mt-2 max-w-[17rem]">
        Tanya apa aja soal misi, promosi, atau strategi jualan di koperasi. Aku bantu semampuku!
      </p>

      <div className="w-full flex flex-col gap-2.5 mt-7">
        <p className="font-body text-caption font-semibold text-neutral text-left px-1">
          Coba mulai dari sini
        </p>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            type="button"
            onClick={() => onPick(s.text)}
            className="flex items-center gap-3 w-full text-left bg-surface-card border-2.5 border-ink rounded-button p-3 shadow-solid-sm active:translate-y-0.5 active:shadow-none transition-all duration-100"
          >
            <span className="w-9 h-9 rounded-full bg-primary-light text-primary border-2 border-ink flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                {s.icon}
              </span>
            </span>
            <span className="font-body text-label font-semibold text-ink flex-1">{s.text}</span>
            <span className="material-symbols-rounded text-neutral flex-shrink-0" style={{ fontSize: 18 }}>
              arrow_outward
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-in-right">
        <div className="max-w-[80%] bg-primary text-white border-2.5 border-ink rounded-card rounded-br-chip shadow-solid-sm px-4 py-3 whitespace-pre-wrap font-body text-body">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-end gap-2 animate-slide-in-left">
      <BotAvatar size={32} />
      <div className="max-w-[80%] bg-surface-card text-ink border-2.5 border-ink rounded-card rounded-bl-chip shadow-solid-sm px-4 py-3 whitespace-pre-wrap font-body text-body">
        {message.text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start items-end gap-2 animate-slide-in-left">
      <BotAvatar size={32} />
      <div className="bg-surface-card border-2.5 border-ink rounded-card rounded-bl-chip shadow-solid-sm px-4 py-4 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-neutral typing-dot" />
        <span className="w-2 h-2 rounded-full bg-neutral typing-dot" style={{ animationDelay: "0.15s" }} />
        <span className="w-2 h-2 rounded-full bg-neutral typing-dot" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}

function LoginGate({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="w-full max-w-[24rem] mt-16">
      <Card animate>
        <div className="flex flex-col items-center text-center mb-4">
          <span className="relative mb-3">
            <BotAvatar size={56} ring />
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary border-2 border-surface-card" />
          </span>
          <h2 className="font-display text-title text-ink">Masuk dulu yuk</h2>
          <p className="font-body text-body text-ink-soft mt-1">
            Masuk buat mulai ngobrol sama Asisten Misi AI.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <FieldInput
            label="Email"
            type="email"
            required
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            valid={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
          />
          <FieldInput
            label="Password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            valid={password.length > 0}
          />
          {error && <p className="font-body text-label text-danger">{error}</p>}
          <PushButton type="submit" disabled={loading} loading={loading} className="w-full mt-1">
            {loading ? "Masuk..." : "Masuk"}
          </PushButton>
        </form>
        <p className="font-body text-label text-neutral text-center mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </Card>
    </div>
  );
}
