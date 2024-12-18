import { useState, useEffect } from "react";

export interface IndustryProgress {
  name: string;
  progress: number;
  total: number;
  closed: number;
}

export interface Stats {
  totalLeads: {
    current: number;
    change: number;
  };
  closedLeads: {
    current: number;
    change: number;
  };
  pendingLeads: {
    current: number;
    change: number;
  };
  conversionRate: {
    current: number;
    change: number;
  };
}

export interface Campaign {
  id: string;
  name: string;
  leads: number;
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
  campaigns: Campaign[];
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
