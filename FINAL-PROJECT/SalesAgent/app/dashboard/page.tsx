"use client";

import { ProjectsGrid } from "@/components/dashboard/projects-grid";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CallsChart } from "@/components/dashboard/calls-chart";
import { TargetsProgress } from "@/components/dashboard/targets-progress";
import { useDashboardData } from "@/hooks/us-dashboard-data";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className='container mx-auto p-6 text-center text-gray-100'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-6 text-center text-red-400'>
        Error: {error}
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold text-gray-100'>Dashboard</h1>

      {/* Stats Overview */}
      <StatsCards stats={data?.stats} />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Charts */}
        <div className='bg-white/10 backdrop-blur-lg rounded-lg p-6'>
          <CallsChart data={data?.callsData} />
        </div>

        {/* Targets Progress */}
        <div className='bg-white/10 backdrop-blur-lg rounded-lg p-6'>
          <TargetsProgress progress={data?.industryProgress} />
        </div>
      </div>

      {/* Projects Grid */}
      <div className='bg-white/10 backdrop-blur-lg rounded-lg p-6'>
        <ProjectsGrid projects={data?.projects} />
      </div>
    </div>
  );
}