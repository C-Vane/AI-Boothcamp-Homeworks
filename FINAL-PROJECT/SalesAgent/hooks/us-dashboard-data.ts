import { useState, useEffect } from "react";

export interface IndustryProgress {
  name: string;
  progress: number;
  total: number;
  completed: number;
}

export interface Stats {
  totalTargets: {
    current: number;
    change: number;
  };
  completedTargets: {
    current: number;
    change: number;
  };
  pendingTargets: {
    current: number;
    change: number;
  };
  conversionRate: {
    current: number;
    change: number;
  };
}

export interface Project {
  id: string;
  name: string;
  targets: number;
  calls: number;
  conversion: string;
}

export interface DashboardData {
  stats: Stats;
  industryProgress: IndustryProgress[];
  callsData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  projects: Project[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const dashboardData = await response.json();

        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return { data, loading, error };
}