import { Bar } from "react-chartjs-2";
import { axisTicks, gridLines, tooltipStyle } from "./chartTheme";
import { formatMoneyCompact } from "../../lib/format";

export default function MonthlyBar({ months }) {
  if (months.length === 0) return null;

  const data = {
    labels: months.map(({ key }) => key),
    datasets: [
      {
        label: "Spending",
        data: months.map(({ amount }) => amount),
        backgroundColor: "#3a3a3a",
        hoverBackgroundColor: "#4a4a4a",
        borderRadius: 4,
        maxBarThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (context) => formatMoneyCompact(context.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: gridLines.color },
        ticks: axisTicks,
      },
      y: {
        beginAtZero: true,
        grid: gridLines,
        border: { display: false },
        ticks: axisTicks,
      },
    },
  };

  return (
    <div className="h-[220px]">
      <Bar data={data} options={options} />
    </div>
  );
}