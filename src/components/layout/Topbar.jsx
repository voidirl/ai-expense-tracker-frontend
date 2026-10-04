import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../lib/navigation";
import { formatToday } from "../../lib/format";

const TITLES = {
  "/": "Dashboard",
  "/expenses": "Expenses",
  "/analytics": "Analytics",
  "/ai": "AI Advisor",
};

export default function Topbar({ onMenuClick, menuOpen = false }) {
  const { pathname } = useLocation();
  const title =
    TITLES[pathname] ?? NAV_ITEMS.find((item) => item.to === pathname)?.label ?? "Dashboard";

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="app-drawer"
          aria-expanded={menuOpen}
          className="-ml-1 rounded-control p-2 text-lg text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink md:hidden"
        >
          <i className="ti ti-menu-2" aria-hidden="true" />
        </button>
        <h1 className="truncate font-sans text-[15px] font-medium">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden font-mono text-xs text-ink-subtle sm:inline">
          {formatToday()}
        </span>
      </div>
    </header>
  );
}