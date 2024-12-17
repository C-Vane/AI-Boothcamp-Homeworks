"use client";

import { CampaignsGrid } from "@/components/dashboard/campaigns-grid";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CallsChart } from "@/components/dashboard/calls-chart";
import { TargetsProgress } from "@/components/dashboard/targets-progress";
import { useDashboardData } from "@/hooks/us-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className='container mx-auto p-6 z-10'>
        <div className='space-y-4'>
          <Skeleton className='h-12 w-[250px] rounded-xl' />{" "}
          {/* Title skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-[150px] w-full rounded-xl' />
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className='h-[300px] w-full rounded-xl' />
            ))}
          </div>
          <Skeleton className='h-[400px] w-full' />
        </div>
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
        <div className='bg-slate/10 backdrop-blur-lg rounded-lg p-6 w-full h-full'>
          <CallsChart data={data?.callsData} />
        </div>

        {/* Targets Progress */}
        <div className='bg-slate/10 backdrop-blur-lg rounded-lg p-6'>
          <TargetsProgress progress={data?.industryProgress} />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className='bg-slate/10 backdrop-blur-lg rounded-lg p-6'>
        <CampaignsGrid campaigns={data?.campaigns || []} />
      </div>
    </div>
  );
}
