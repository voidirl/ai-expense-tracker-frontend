import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-5 py-16">
      <EmptyState
        icon="ti-map-2"
        title="Page not found"
        description="That route does not exist."
        action={
          <Link
            to="/"
            className="rounded-control bg-accent px-4 py-2 font-sans text-xs font-medium text-canvas transition-colors hover:bg-ink"
          >
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}