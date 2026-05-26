import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseCard from "./ExpenseCard";
import { getAllExpenses, getTotalSum } from "../services/expenseServices";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const handleRefresh = () => setRefresh(prev => prev + 1);

  useEffect(() => {
    getTotalSum().then(setTotal);
    getAllExpenses().then(setExpenses);
  }, [refresh]);

  const topCategory = () => {
    if (!expenses.length) return { name: "—", amount: 0 };
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return { name: top[0], amount: top[1] };
  };

  const cat = topCategory();

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#0d0d0d",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e8e6e1",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "0.5px solid #1e1e1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "15px", fontWeight: 500 }}>Dashboard</span>
          <span style={{ fontSize: "12px", color: "#444", fontFamily: "DM Mono, monospace" }}>
            {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: "12px" }}>
            <ExpenseCard title="Total Spent" amount={`₹${total.toLocaleString("en-IN")}`} sub="this month" />
            <ExpenseCard title="Expenses" amount={expenses.length} sub="transactions" />
            <ExpenseCard title="Top Category" amount={cat.name} sub={`₹${cat.amount.toLocaleString("en-IN")} spent`} />
          </div>

          {/* Add Expense Form */}
          <div>
            <div style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Add Expense
            </div>
            <div style={{ background: "#111", border: "0.5px solid #1e1e1e", borderRadius: "10px", padding: "18px 20px" }}>
              <ExpenseForm onExpenseAdded={handleRefresh} />
            </div>
          </div>

          {/* Expense List */}
          <div>
            <div style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Recent Expenses
            </div>
            <ExpenseList key={`list-${refresh}`} onExpenseDeleted={handleRefresh} />
          </div>

        </div>
      </div>
    </div>
  );
}