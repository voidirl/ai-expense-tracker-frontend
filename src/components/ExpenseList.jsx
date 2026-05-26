import { useEffect, useState } from "react";
import { getAllExpenses, deleteExpense } from "../services/expenseServices";

const categoryColors = {
  Food: "#4a7c59",
  Rent: "#7c4a4a",
  Travel: "#4a5f7c",
  Shopping: "#7c6a4a",
  Health: "#4a7c7c",
  Other: "#2a2a2a",
};

const ExpenseList = ({ onExpenseDeleted }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
      onExpenseDeleted();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) return (
    <p style={{ fontSize: "13px", color: "#333", fontFamily: "'DM Mono', monospace" }}>Loading...</p>
  );

  if (expenses.length === 0) return (
    <p style={{ fontSize: "13px", color: "#333" }}>No expenses yet.</p>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {expenses.map((expense, i) => (
        <div key={expense.id} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 0",
          borderBottom: "0.5px solid #161616",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: categoryColors[expense.category] || "#2a2a2a",
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: "13px", color: "#c8c6c1" }}>{expense.title}</div>
              <div style={{ fontSize: "11px", color: "#383838", marginTop: "1px" }}>{expense.category}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8e6e1", fontFamily: "'DM Mono', monospace" }}>
                ₹{expense.amount.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "11px", color: "#333", fontFamily: "'DM Mono', monospace" }}>
                {expense.expenseDate}
              </div>
            </div>
            <button onClick={() => handleDelete(expense.id)} style={{
              background: "transparent",
              border: "none",
              color: "#2a2a2a",
              cursor: "pointer",
              fontSize: "16px",
              padding: "4px",
              lineHeight: 1,
              transition: "color 0.15s",
            }}
              onMouseEnter={e => e.target.style.color = "#7c4a4a"}
              onMouseLeave={e => e.target.style.color = "#2a2a2a"}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;