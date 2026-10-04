import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Layout route. Every page renders inside this shell, so the sidebar and
 * topbar can no longer be forgotten on a new route — previously /analytics,
 * /ai and /add rendered with no navigation at all.
 */
export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas font-sans text-ink">
      <Sidebar open={drawerOpen} onClose={closeDrawer} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          menuOpen={drawerOpen}
          onMenuClick={() => setDrawerOpen((previous) => !previous)}
        />
        {/* Pages scroll here by default; full-height pages such as the AI chat
            set h-full and manage their own scrolling. */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}