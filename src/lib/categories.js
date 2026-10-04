/**
 * Single source of truth for categories. The backend stores `category` as a
 * free-text String, so this list is also what the <select> offers; anything the
 * server returns that isn't listed still renders (via categoryColor's fallback).
 *
 * Colours are raw hex rather than utility classes because Chart.js needs real
 * colour values to paint onto a canvas.
 */
export const CATEGORIES = [
  { name: 'Food', color: '#4a7c59' },
  { name: 'Rent', color: '#7c4a4a' },
  { name: 'Travel', color: '#4a5f7c' },
  { name: 'Shopping', color: '#7c6a4a' },
  { name: 'Health', color: '#4a7c7c' },
  { name: 'Other', color: '#5a5a5a' },
];

export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);

const COLOR_BY_NAME = new Map(CATEGORIES.map(({ name, color }) => [name, color]));

/** Palette used when there are more categories than preset colours. */
export const EXTRA_COLORS = [
  '#6a4a7c',
  '#7c7c4a',
  '#4a4a7c',
  '#7c5a4a',
  '#4a7c6a',
  '#6b6b3a',
];

export function categoryColor(name) {
  return COLOR_BY_NAME.get(name) ?? '#5a5a5a';
}

/** Stable colour for a category index, so charts stay consistent across renders. */
export function colorAt(index) {
  return index < CATEGORIES.length
    ? CATEGORIES[index].color
    : EXTRA_COLORS[index % EXTRA_COLORS.length];
}