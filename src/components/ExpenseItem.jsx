const ExpenseItem = ({ expense, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-700">{expense.title}</p>
        <p className="text-xs text-gray-400">{expense.category} • {expense.date}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-bold text-red-500">₹ {expense.amount}</p>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-xs text-red-400 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;