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

  useEffect(() => {
    getAllExpenses().then(setExpenses).catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://expense-tracker-ai-service-production.up.railway.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, expenses }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 text-white">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">AI Advisor</h1>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-lg px-4 py-2 rounded-2xl text-sm ${
              msg.role === "user"
                ? "bg-cyan-600 text-white"
                : "bg-slate-800 text-gray-200"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-2 rounded-2xl text-sm text-gray-400">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Ask about your expenses..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-xl font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}