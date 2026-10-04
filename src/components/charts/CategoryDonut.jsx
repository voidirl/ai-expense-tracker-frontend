import { Doughnut } from "react-chartjs-2";
import { legendStyle, tooltipStyle } from "./chartTheme";
import { formatMoneyCompact } from "../../lib/format";

export default function CategoryDonut({ categories }) {
  if (categories.length === 0) return null;

  const data = {
    labels: categories.map(({ name }) => name),
    datasets: [
      {
        data: categories.map(({ amount }) => amount),
        backgroundColor: categories.map(({ color }) => color),
        borderColor: "#111111",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: legendStyle,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (context) => `${context.label}: ${formatMoneyCompact(context.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="mx-auto h-[220px] max-w-[240px]">
      <Doughnut data={data} options={options} />
    </div>
  );
}