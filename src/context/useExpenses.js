import { useContext } from "react";
import { ExpensesContext } from "./ExpensesContext";

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used inside <ExpensesProvider>");
  }
  return context;
}