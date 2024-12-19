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
        label: "Total Calls",
        data: data.datasets[0].data,
        borderColor: "rgb(14, 116, 144)", // cyan-700
        backgroundColor: "rgba(14, 116, 144, 0.5)",
      },
      {
        label: "Successful Calls",
        data: data.datasets[1].data,
        borderColor: "rgb(4, 120, 87)", // emerald-700
        backgroundColor: "rgba(4, 120, 87, 0.5)",
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
