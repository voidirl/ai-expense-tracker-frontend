import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../lib/navigation";

function NavItems({ onNavigate }) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {NAV_ITEMS.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 border-l-2 py-2.5 pl-4 pr-3 font-sans text-[13px] transition-colors ${
              isActive
                ? "border-l-ink bg-surface-raised text-ink"
                : "border-l-transparent text-ink-subtle hover:bg-surface-hover hover:text-ink-muted"
            }`
          }
        >
          <i className={`ti ${icon} text-[15px]`} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="px-5 pb-6 font-sans text-xs font-medium uppercase tracking-[0.08em] text-ink-subtle">
      VoidLedger
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  // Render one or the other so the drawer/backdrop never mounts on desktop.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = (event) => setIsMobile(event.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMobile) {
    return (
      <aside className="flex w-[200px] shrink-0 flex-col border-r border-line bg-surface py-6">
        <Brand />
        <NavItems />
      </aside>
    );
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        id="app-drawer"
        className={`fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-line bg-surface py-6 transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation"
        aria-hidden={!open}
      >
        <Brand />
        <NavItems onNavigate={onClose} />
      </aside>
    </>
  );
}