"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CallsChartProps {
  data?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "rgb(229, 231, 235)", // text-gray-200
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: "rgba(229, 231, 235, 0.1)", // text-gray-200 with opacity
      },
      ticks: {
        color: "rgb(229, 231, 235)", // text-gray-200
      },
    },
    x: {
      grid: {
        color: "rgba(229, 231, 235, 0.1)", // text-gray-200 with opacity
      },
      ticks: {
        color: "rgb(229, 231, 235)", // text-gray-200
      },
    },
  },
};

export function CallsChart({ data }: CallsChartProps) {
  if (!data) return null;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        ...data.datasets[0],
        borderColor: "rgb(59, 130, 246)", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        ...data.datasets[1],
        borderColor: "rgb(34, 197, 94)", // green-500
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className='text-lg font-semibold text-gray-100'>Calls Overview</h3>
      <div className='h-[10rem] md:h-[20rem]'>
        <Line options={options} data={chartData} />
      </div>
    </>
  );
}
