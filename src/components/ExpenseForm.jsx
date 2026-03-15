import { useState } from "react";
import { addExpense } from "../services/expenseServices";

const ExpenseForm = ({ onExpenseAdded }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    onExpenseAddedate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", form);
    setLoading(true);
    try {
      await addExpense({
        ...form,
        amount: parseFloat(form.amount),
      });
      setForm({ title: "", amount: "", category: "", date: "" });
      onExpenseAdded();
    } catch (err) {
      console.error("Failed to add expense:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-96">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Add Expense</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-800 text-white"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-800 text-white"
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Food, Travel)"
          value={form.category}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-800 text-white"
        />
        <input
          type="date"
          name="expenseDate"
          value={form.date}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-800 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;