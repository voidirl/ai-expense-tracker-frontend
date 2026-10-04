export const EMPTY_FILTERS = {
  search: "",
  category: "",
  from: "",
  to: "",
};

export function hasActiveFilters(filters) {
  return Boolean(filters.search || filters.category || filters.from || filters.to);
}