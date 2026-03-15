import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TotalSum from "./TotalSum";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseCard from "./ExpenseCard";
import { getAllExpenses, getTotalSum } from "../services/expenseServices";
import { useEffect } from "react";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0);
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  useEffect(() => {
    getTotalSum().then(setTotal);
    getAllExpenses().then(setExpenses);
  }, [refresh]);

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ padding: "20px", flex: 1 }}>
          <h1>Dashboard</h1>

          {/* Cards */}
          <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            <ExpenseCard title="Total Spent" amount={`₹${total}`} />
            <ExpenseCard title="Expenses" amount={expenses.length} />
          </div>

          {/* Add Expense Form */}
          <div style={{ marginTop: "40px" }}>
            <ExpenseForm onExpenseAdded={handleRefresh} />
          </div>

          {/* Expense List */}
          <div style={{ marginTop: "40px" }}>
            <ExpenseList key={`list-${refresh}`} onExpenseDeleted={handleRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
}