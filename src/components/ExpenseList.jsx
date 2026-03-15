import { useEffect, useState } from "react";
import { getAllExpenses, deleteExpense } from "../services/expenseServices";
import ExpenseItem from "./ExpenseItem";

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

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
      onExpenseDeleted();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  if (loading) return <p className="text-gray-400">Loading expenses...</p>;

  return (
    <div className="flex flex-col gap-3 w-96">
      <h2 className="text-lg font-bold text-gray-700">All Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-400 text-sm">No expenses yet!</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default ExpenseList;