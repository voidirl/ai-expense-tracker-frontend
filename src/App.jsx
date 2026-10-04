import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AiAdvisor from "./pages/AiAdvisor";
import NotFound from "./pages/NotFound";
import Spinner from "./components/ui/Spinner";
import ExpensesProvider from "./context/ExpensesProvider";

// Chart.js is the heaviest dependency and is only needed on /analytics.
const Analytics = lazy(() => import("./pages/Analytics"));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner />
    </div>
  );
}

/**
 * Every page is nested under the AppShell layout route, so the sidebar and
 * topbar are guaranteed on all of them. Analytics, /ai and the old /add route
 * previously rendered with no navigation at all.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ExpensesProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Analytics />
                </Suspense>
              }
            />
            <Route path="ai" element={<AiAdvisor />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ExpensesProvider>
    </BrowserRouter>
  );
}