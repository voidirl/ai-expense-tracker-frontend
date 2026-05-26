import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "ti-layout-dashboard" },
  { to: "/analytics", label: "Analytics", icon: "ti-chart-bar" },
  { to: "/ai", label: "AI Advisor", icon: "ti-robot" },
  { to: "/add", label: "Add Expense", icon: "ti-plus" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <div style={{
      width: "200px", minHeight: "100vh", background: "#111",
      borderRight: "0.5px solid #1e1e1e", display: "flex",
      flexDirection: "column", padding: "24px 0", flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        padding: "0 20px 28px", fontSize: "12px", fontWeight: 500,
        letterSpacing: "0.08em", color: "#888", textTransform: "uppercase",
      }}>
        VoidLedger
      </div>
      {navItems.map(({ to, label, icon }) => {
        const active = pathname === to;
        return (
          <Link key={to} to={to} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 20px", fontSize: "13px", textDecoration: "none",
            color: active ? "#e8e6e1" : "#666",
            background: active ? "#1a1a1a" : "transparent",
            borderLeft: active ? "2px solid #e8e6e1" : "2px solid transparent",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#e8e6e1"; e.currentTarget.style.background = "#161616"; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#666"; e.currentTarget.style.background = "transparent"; }}}
          >
            <i className={`ti ${icon}`} style={{ fontSize: "15px" }} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}