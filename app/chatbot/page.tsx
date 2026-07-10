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
      setLoginError(
        err instanceof ApiError ? err.message : "Gagal login. Coba lagi."
      );
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
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
        setChatError(
          err instanceof ApiError ? err.message : "Gagal menghubungi chatbot."
        );
      }
    } finally {
      setSending(false);
    }
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
            <div className="flex-1 overflow-y-auto px-md">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState />
                </div>
              ) : (
                <div className="flex flex-col gap-4 py-6">
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
                  <p className="font-body text-label text-danger px-2">{chatError}</p>
                )}
                <div className="flex items-end gap-2 bg-surface-card border-2.5 border-border-soft focus-within:border-primary rounded-button shadow-solid-sm p-2 transition-colors">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    className="flex-grow bg-transparent border-none focus:ring-0 resize-none font-body text-body text-ink placeholder-neutral min-h-[48px] max-h-32 py-3 px-2"
                    placeholder="Tulis pertanyaanmu..."
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !input.trim()}
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

function EmptyState() {
  return (
    <div className="w-full flex flex-col items-center text-center mt-12">
      <div
        className="w-48 h-48 mb-8 rounded-full bg-surface-sunken flex items-center justify-center relative overflow-hidden bg-cover bg-center border-2.5 border-ink shadow-solid-md"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB20akA2BAbVwD-yGNPldRQMjbuWeuXEuSDkRKWo8MkMYGnF26eMedHwhVy3Vcw4L6pEOe4JLSlMxU5dwtnav5SYKjdQi1clkeUJfIk0jz4oZ9efWIVT11Uj9QbDJ2XXp6As-xQch-F9ORoSd5T6Zab6aKgMfXs4lUKcExL6z9nS11_Oe9a78OlEOzzjlvJkB-3toptmXszgTAoGAhas7lJjgnISeIFwj_iBuivnJq4Nyyi29Pf120-Xw')",
        }}
      />
      <Card className="mb-8 w-full">
        <h2 className="font-display text-title text-ink mb-2">AI Mission Assistant</h2>
        <p className="font-body text-body text-ink-soft">
          Ajukan pertanyaan seputar misi, promosi, strategi pemasaran, atau hal
          lain yang dapat membantumu menyelesaikan misi.
        </p>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-card border-2 border-ink px-4 py-3 whitespace-pre-wrap font-body text-body ${
          isUser
            ? "bg-primary text-white rounded-br-chip"
            : "bg-surface-card text-ink rounded-bl-chip"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-surface-card text-ink-soft border-2 border-ink rounded-card rounded-bl-chip px-4 py-3 font-body text-body">
        Mengetik...
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
        <h2 className="font-display text-title text-ink mb-2">Masuk dulu</h2>
        <p className="font-body text-body text-ink-soft mb-4">
          Masuk diperlukan untuk mengobrol dengan AI Mission Assistant.
        </p>
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
