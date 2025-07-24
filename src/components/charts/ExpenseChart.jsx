import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function ExpenseChart({ type, data, title }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="p-4 bg-card rounded-lg border">
      {type === 'bar' ? (
        <Bar data={data} options={options} />
      ) : (
        <Doughnut data={data} options={doughnutOptions} />
      )}
    </div>
  );
}