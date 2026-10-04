import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Resolved from the CSS custom properties in src/index.css so charts and DOM
// text can never drift apart.
const INK = "#8a8a8a";
const LINE = "#1e1e1e";
const SURFACE = "#111111";
const MONO = "'DM Mono', monospace";
const SANS = "'DM Sans', sans-serif";

export const tooltipStyle = {
  backgroundColor: SURFACE,
  borderColor: LINE,
  borderWidth: 1,
  titleColor: "#e8e6e1",
  bodyColor: "#c8c6c1",
  titleFont: { family: SANS, size: 11 },
  bodyFont: { family: MONO, size: 11 },
  padding: 8,
  cornerRadius: 6,
  displayColors: false,
};

export const axisTicks = {
  color: INK,
  font: { family: MONO, size: 10 },
};

export const gridLines = {
  color: "#161616",
  drawTicks: false,
};

export const legendStyle = {
  position: "bottom",
  labels: {
    color: INK,
    boxWidth: 6,
    boxHeight: 6,
    usePointStyle: true,
    pointStyle: "circle",
    padding: 12,
    font: { family: SANS, size: 10 },
  },
};