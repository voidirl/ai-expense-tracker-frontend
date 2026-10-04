import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ErrorBanner from "../components/ui/ErrorBanner";
import { useExpenses } from "../context/useExpenses";
import { askAdvisor } from "../services/aiService";

const GREETING = {
  role: "ai",
  text: "Hi! I'm your AI financial advisor. Ask me about your spending habits, budgets, or where your money is going.",
};

const SUGGESTIONS = [
  "Where am I spending the most this month?",
  "Which category has grown the fastest?",
  "How much do I spend on food on average?",
];

export default function AiAdvisor() {
  const { expenses, status, error: loadError, reload } = useExpenses();
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState(null);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  // Abort any in-flight request if the user navigates away mid-answer.
  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = async (text) => {
    const message = text.trim();
    if (!message || sending) return;

    setMessages((previous) => [...previous, { role: "user", text: message }]);
    setInput("");
    setChatError(null);
    setSending(true);

    abortRef.current = new AbortController();

    try {
      const reply = await askAdvisor({
        message,
        expenses,
        signal: abortRef.current.signal,
      });
      setMessages((previous) => [...previous, { role: "ai", text: reply }]);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setChatError(err);
    } finally {
      setSending(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-6 md:px-7">
        {loadError && <ErrorBanner error={loadError} onRetry={reload} />}

        {messages.length === 1 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-line px-3 py-1.5 font-sans text-[11px] text-ink-subtle transition-colors hover:border-ink-subtle hover:text-ink"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-panel border border-line px-3.5 py-2.5 font-sans text-[13px] leading-relaxed sm:max-w-[60%] ${
                message.role === "user"
                  ? "bg-surface-raised text-ink"
                  : "bg-surface text-ink-muted"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-panel border border-line bg-surface px-3.5 py-2.5">
              <Spinner />
              <span className="font-mono text-[11px] text-ink-faint">thinking…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-line px-5 py-4 md:px-7">
        {chatError && (
          <p
            role="alert"
            className="mb-3 flex items-center gap-2 font-sans text-[11px] text-danger"
          >
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {chatError.message}
          </p>
        )}

        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <label htmlFor="advisor-input" className="sr-only">
            Ask about your expenses
          </label>
          <textarea
            id="advisor-input"
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your expenses…"
            maxLength={1000}
            className="max-h-32 min-h-[38px] flex-1 resize-y rounded-control border border-line-strong bg-surface px-3 py-2.5 font-sans text-[13px] text-ink placeholder:text-ink-faint focus:border-ink-subtle"
          />
          <Button type="submit" loading={sending} disabled={!input.trim()}>
            Send
          </Button>
        </form>

        {status === "loading" && (
          <p className="mt-2 font-sans text-[11px] text-ink-faint">
            Loading your transactions for context…
          </p>
        )}
      </div>
    </div>
  );
}