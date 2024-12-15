"use client";

import { Stats } from "@/hooks/us-dashboard-data";
import { Phone, Target, Clock, Briefcase } from "lucide-react";

interface StatsCardsProps {
  stats: Stats | undefined;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatCard
        title='Total Targets'
        value={stats.totalTargets.current}
        change={stats.totalTargets.change}
        icon={<Target className='w-4 h-4' />}
      />
      <StatCard
        title='Completed'
        value={stats.completedTargets.current}
        change={stats.completedTargets.change}
        icon={<Phone className='w-4 h-4' />}
      />
      <StatCard
        title='Pending'
        value={stats.pendingTargets.current}
        change={stats.pendingTargets.change}
        icon={<Clock className='w-4 h-4' />}
      />
      <StatCard
        title='Conversion Rate'
        value={stats.conversionRate.current}
        change={stats.conversionRate.change}
        icon={<Briefcase className='w-4 h-4' />}
        isPercentage
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  isPercentage = false,
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  isPercentage?: boolean;
}) {
  const isPositive = change > 0;
  const changeString =
    (isPositive ? "+ " : "") + (change?.toFixed(2) || 0) + " %";
  const valueString = isPercentage ? `${value}%` : value;

  return (
    <div className='bg-white/10 backdrop-blur-lg rounded-lg p-6 flex flex-col'>
      <div className='flex items-center justify-between'>
        <span className='text-gray-200 text-sm'>{title}</span>
        <span className='text-gray-200'>{icon}</span>
      </div>
      <div className='mt-4'>
        <span className='text-2xl font-bold text-gray-100'>{valueString}</span>
        <span
          className={`ml-2 text-sm ${
            isPositive ? "text-green-400" : "text-blue-400"
          }`}>
          {changeString}
        </span>
      </div>
    </div>
  );
}
