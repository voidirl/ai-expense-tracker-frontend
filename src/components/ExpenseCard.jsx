export default function ExpenseCard({ title, amount, sub }) {
  return (
    <div style={{
      background: "#111",
      border: "0.5px solid #1e1e1e",
      borderRadius: "10px",
      padding: "18px 20px",
      flex: 1,
    }}>
      <div style={{ fontSize: "11px", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>{title}</div>
      <div style={{ fontSize: "26px", fontWeight: 300, color: "#e8e6e1", fontFamily: "DM Mono, monospace" }}>{amount}</div>
      {sub && <div style={{ fontSize: "11px", color: "#3a3a3a", marginTop: "6px" }}>{sub}</div>}
    </div>
  );
}