import { useState, useEffect, useRef } from "react";
import { getAllExpenses } from "../services/expenseServices";

export default function AiAdvisor() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI financial advisor. Ask me anything about your spending habits or budgeting!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { getAllExpenses().then(setExpenses).catch(console.error); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://expense-tracker-ai-service.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, expenses }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", background: "#0d0d0d", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Topbar */}
      <div style={{ padding: "20px 28px", borderBottom: "0.5px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: "15px", fontWeight: 500, color: "#e8e6e1" }}>AI Advisor</span>
        <span style={{ fontSize: "12px", color: "#444", fontFamily: "'DM Mono', monospace" }}>llama-3.3-70b</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "60%", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.6",
              background: msg.role === "user" ? "#1a1a1a" : "#111",
              color: msg.role === "user" ? "#e8e6e1" : "#c8c6c1",
              border: "0.5px solid #1e1e1e",
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", color: "#444", background: "#111", border: "0.5px solid #1e1e1e", fontFamily: "'DM Mono', monospace" }}>
              thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "16px 28px", borderTop: "0.5px solid #1e1e1e", display: "flex", gap: "10px", flexShrink: 0 }}>
        <input
          style={{
            flex: 1, background: "#111", border: "0.5px solid #222", borderRadius: "6px",
            padding: "10px 14px", fontSize: "13px", color: "#e8e6e1",
            fontFamily: "'DM Sans', sans-serif", outline: "none",
          }}
          placeholder="Ask about your expenses..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          onFocus={e => e.target.style.borderColor = "#444"}
          onBlur={e => e.target.style.borderColor = "#222"}
        />
        <button onClick={sendMessage} style={{
          background: "#e8e6e1", color: "#0d0d0d", border: "none",
          borderRadius: "6px", padding: "10px 20px", fontSize: "12px",
          fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.03em",
        }}>
          Send
        </button>
      </div>
    </div>
  );
}