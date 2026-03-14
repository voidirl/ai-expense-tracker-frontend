import { useState } from "react";

import TotalSum from "./components/TotalSum";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";

function App(){
  const [refresh,setRefresh] = useState(0);

  const handleExpenseAdded = () => {
    setRefresh(prev => prev +1);
  };
  return(
    <div className="p-8 flex flex-col gap-6">
      <TotalSum key = {refresh} />
      <AddExpense onExpenseAdded={handleExpenseAdded} />
      <ExpenseForm key ={refresh} />
      </div>
  );
}

export default App;