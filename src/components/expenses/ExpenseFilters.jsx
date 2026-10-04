import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { EMPTY_FILTERS, hasActiveFilters } from "../../lib/filters";

/**
 * Runs client-side over the already-loaded list. The backend's /category/{c}
 * and /date/{d} endpoints only support exact matches, so there is nothing to
 * gain from a round trip per keystroke.
 */
export default function ExpenseFilters({
  filters,
  onChange,
  categories,
  resultCount,
}) {
  const update = (patch) => onChange({ ...filters, ...patch });
  const filtering = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          id="filter-search"
          label="Search"
          type="search"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search titles…"
        />

        <Select
          id="filter-category"
          label="Category"
          value={filters.category}
          onChange={(event) => update({ category: event.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>

        <Input
          id="filter-from"
          label="From"
          type="date"
          value={filters.from}
          onChange={(event) => update({ from: event.target.value })}
        />

        <Input
          id="filter-to"
          label="To"
          type="date"
          value={filters.to}
          min={filters.from || undefined}
          onChange={(event) => update({ to: event.target.value })}
        />
      </div>

      {filtering ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-sans text-[11px] text-ink-faint">
            {resultCount} matching {resultCount === 1 ? "expense" : "expenses"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            <i className="ti ti-filter-off" aria-hidden="true" />
            Clear filters
          </Button>
        </div>
      ) : (
        <span className="font-sans text-[11px] text-ink-faint">
          Showing all {resultCount} expenses
        </span>
      )}
    </div>
  );
}