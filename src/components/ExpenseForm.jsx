import { useState } from "react";
import { addExpense } from "../services/expenseServices";

const inputStyle = {
  background: "#0d0d0d",
  border: "0.5px solid #222",
  borderRadius: "6px",
  padding: "9px 12px",
  fontSize: "13px",
  color: "#e8e6e1",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  width: "100%",
  transition: "border 0.15s",
};

const labelStyle = {
  fontSize: "11px",
  color: "#444",
  letterSpacing: "0.05em",
  marginBottom: "6px",
  display: "block",
};

const ExpenseForm = ({ onExpenseAdded }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    expenseDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense({ ...form, amount: parseFloat(form.amount) });
      setForm({ title: "", amount: "", category: "", expenseDate: "" });
      onExpenseAdded();
    } catch (err) {
      console.error("Failed to add expense:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} type="text" name="title" placeholder="e.g. Groceries" value={form.title} onChange={handleChange} required
            onFocus={e => e.target.style.borderColor = "#444"}
            onBlur={e => e.target.style.borderColor = "#222"} />
        </div>
        <div>
          <label style={labelStyle}>Amount</label>
          <input style={inputStyle} type="number" name="amount" placeholder="₹0" value={form.amount} onChange={handleChange} required
            onFocus={e => e.target.style.borderColor = "#444"}
            onBlur={e => e.target.style.borderColor = "#222"} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">Select...</option>
            <option>Food</option>
            <option>Rent</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Health</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input style={inputStyle} type="date" name="expenseDate" value={form.expenseDate} onChange={handleChange} required
            onFocus={e => e.target.style.borderColor = "#444"}
            onBlur={e => e.target.style.borderColor = "#222"} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" disabled={loading} style={{
          background: "#e8e6e1",
          color: "#0d0d0d",
          border: "none",
          borderRadius: "6px",
          padding: "9px 24px",
          fontSize: "12px",
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.03em",
          opacity: loading ? 0.5 : 1,
          transition: "opacity 0.15s",
        }}>
          {loading ? "Adding..." : "Add expense"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;