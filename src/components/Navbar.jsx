export default function Navbar() {
  return (
    <div style={{
      height: "56px", background: "#0d0d0d",
      borderBottom: "0.5px solid #1e1e1e",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px", flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#e8e6e1", letterSpacing: "0.02em" }}>
        Smart Expense Tracker
      </span>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <i className="ti ti-bell" style={{ fontSize: "18px", color: "#444", cursor: "pointer" }} aria-hidden="true" />
        <i className="ti ti-user-circle" style={{ fontSize: "20px", color: "#444", cursor: "pointer" }} aria-hidden="true" />
      </div>
    </div>
  );
}