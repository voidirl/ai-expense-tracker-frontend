import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Analytics from "./components/Analytics";
import "./styles/global.css";
import AiAdvisor from "./components/AiAdvisor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<ExpenseForm />} />
        <Route path="/list" element={<ExpenseList />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="ai/" element={<AiAdvisor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;