import { useEffect, useState } from "react";
import { Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { getAllExpenses } from "../services/expenseServices";

ChartJs.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DOT_COLORS = ["#4a7c59", "#7c4a4a", "#4a5f7c", "#7c6a4a", "#4a7c7c", "#6a4a7c", "#7c7c4a", "#4a4a7c"];

const statCard = (label, value, mono = false) => (
  <div style={{ background: "#111", border: "0.5px solid #1e1e1e", borderRadius: "10px", padding: "18px 20px", flex: 1 }}>
    <div style={{ fontSize: "11px", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>{label}</div>
    <div style={{ fontSize: "22px", fontWeight: 300, color: "#e8e6e1", fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif" }}>{value}</div>
  </div>
);

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllExpenses().then(setExpenses).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "#444" }}>
      Loading...
    </div>
  );

  if (expenses.length === 0) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#444" }}>
      No expenses yet.
    </div>
  );

  const categoryMap = {};
  expenses.forEach(({ category, amount }) => {
    categoryMap[category] = (categoryMap[category] || 0) + amount;
  });
  const categories = Object.keys(categoryMap);
  const categoryAmounts = Object.values(categoryMap);

  const monthMap = {};
  expenses.forEach(({ expenseDate, amount }) => {
    const month = new Date(expenseDate).toLocaleString("default", { month: "short", year: "numeric" });
    monthMap[month] = (monthMap[month] || 0) + amount;
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const highestCategory = categories.reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b, categories[0]);
  const recent = [...expenses].sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)).slice(0, 5);

  const donutData = {
    labels: categories,
    datasets: [{ data: categoryAmounts, backgroundColor: DOT_COLORS.slice(0, categories.length), borderColor: "#111", borderWidth: 2 }],
  };

  const barData = {
    labels: Object.keys(monthMap),
    datasets: [{ label: "Monthly Spending (₹)", data: Object.values(monthMap), backgroundColor: "#2a2a2a", borderRadius: 4 }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#555", font: { family: "'DM Sans'" } } },
    },
    scales: {
      x: { ticks: { color: "#555", font: { family: "'DM Mono'" } }, grid: { color: "#161616" } },
      y: { ticks: { color: "#555", font: { family: "'DM Mono'" } }, grid: { color: "#161616" } },
    },
  };

  const sectionLabel = (text) => (
    <div style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>{text}</div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "15px", fontWeight: 500, color: "#e8e6e1" }}>Analytics</span>
        <span style={{ fontSize: "12px", color: "#444", fontFamily: "'DM Mono', monospace" }}>
          {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: "12px" }}>
        {statCard("Total Spent", `₹${total.toLocaleString("en-IN")}`, true)}
        {statCard("Top Category", highestCategory)}
        {statCard("Transactions", expenses.length, true)}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ background: "#111", border: "0.5px solid #1e1e1e", borderRadius: "10px", padding: "20px" }}>
          {sectionLabel("By Category")}
          <div style={{ maxWidth: "220px", margin: "0 auto" }}>
            <Doughnut data={donutData} options={{ plugins: { legend: { labels: { color: "#555", font: { family: "'DM Sans'" } } } } }} />
          </div>
        </div>
        <div style={{ background: "#111", border: "0.5px solid #1e1e1e", borderRadius: "10px", padding: "20px" }}>
          {sectionLabel("Monthly Spending")}
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: "#111", border: "0.5px solid #1e1e1e", borderRadius: "10px", padding: "20px" }}>
        {sectionLabel("Recent Transactions")}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {recent.map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid #161616" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#c8c6c1" }}>{e.title}</div>
                <div style={{ fontSize: "11px", color: "#383838", marginTop: "2px" }}>{e.category} · {new Date(e.expenseDate).toLocaleDateString("en-IN")}</div>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8e6e1", fontFamily: "'DM Mono', monospace" }}>
                ₹{e.amount.toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}