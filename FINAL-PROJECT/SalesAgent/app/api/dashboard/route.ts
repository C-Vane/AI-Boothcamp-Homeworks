import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Target, Project, Call } from "@/models";
import { getServerSession } from "next-auth";

import mongoose from "mongoose";
import { DashboardData, IndustryProgress } from "@/hooks/us-dashboard-data";
import { authOptions } from "../auth/[...nextauth]/auth";

interface DailyCallStats {
  _id: string;
  totalCalls: number;
  successfulCalls: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get admin's projects with aggregated data
    const projects = await Project.aggregate([
      {
        $match: {
          adminId: new mongoose.Types.ObjectId(session.user.id),
        },
      },
      {
        $lookup: {
          from: "targets",
          localField: "_id",
          foreignField: "projectId",
          as: "projectTargets",
        },
      },
      {
        $lookup: {
          from: "calls",
          localField: "projectTargets._id",
          foreignField: "targetId",
          as: "projectCalls",
        },
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          targets: { $size: "$projectTargets" },
          calls: { $size: "$projectCalls" },
          conversion: {
            $concat: [
              {
                $toString: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $cond: [
                            { $eq: [{ $size: "$projectCalls" }, 0] },
                            0,
                            {
                              $divide: [
                                {
                                  $size: {
                                    $filter: {
                                      input: "$projectTargets",
                                      as: "target",
                                      cond: {
                                        $eq: ["$$target.status", "completed"],
                                      },
                                    },
                                  },
                                },
                                { $size: "$projectTargets" },
                              ],
                            },
                          ],
                        },
                        100,
                      ],
                    },
                    0,
                  ],
                },
              },
              "%",
            ],
          },
        },
      },
    ]);

    // Get all targets for admin's projects
    const adminProjects = await Project.find({
      adminId: new mongoose.Types.ObjectId(session.user.id),
    });

    const projectIds = adminProjects.map((project) => project._id);

    const targets = await Target.find({
      projectId: { $in: projectIds },
    });

    const targetIds = targets.map((target) => target._id);

    const lastWeekTargets = await Target.find({
      projectId: { $in: projectIds },
      lastContact: {
        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Calculate stats
    const currentTargets = targets.length;
    const previousTargets = lastWeekTargets.length;
    const targetsChange =
      ((currentTargets - previousTargets) / previousTargets) * 100;

    const currentCompletedTargets = targets.filter(
      (target) => target.status === "completed"
    ).length;
    const previousCompletedTargets = lastWeekTargets.filter(
      (target) => target.status === "completed"
    ).length;
    const completedTargetsChange =
      ((currentCompletedTargets - previousCompletedTargets) /
        previousCompletedTargets) *
      100;

    const currentPendingTargets = targets.filter(
      (target) => target.status !== "failed" && target.status !== "completed"
    ).length;
    const previousPendingTargets = lastWeekTargets.filter(
      (target) => target.status !== "failed" && target.status !== "completed"
    ).length;
    const pendingTargetsChange =
      ((currentPendingTargets - previousPendingTargets) /
        previousPendingTargets) *
      100;

    const currentConversionRate =
      currentTargets > 0
        ? Math.round((currentCompletedTargets / currentTargets) * 100)
        : 0;
    const pastConversionRate =
      previousTargets > 0
        ? Math.round((previousCompletedTargets / previousTargets) * 100)
        : 0;
    const conversionRateChange =
      (currentConversionRate - pastConversionRate) / pastConversionRate;
    // Group targets by industry for progress tracking
    const targetsByIndustry = targets.reduce<Record<string, IndustryProgress>>(
      (acc, target) => {
        if (!acc[target.industry]) {
          acc[target.industry] = {
            total: 0,
            completed: 0,
            name: target.industry,
            progress: 0,
          };
        }
        acc[target.industry].total++;
        if (target.status === "completed") {
          acc[target.industry].completed++;
          acc[target.industry].progress = Math.round(
            (acc[target.industry].completed / acc[target.industry].total) * 100
          );
        }
        return acc;
      },
      {}
    );

    // Calculate industry progress
    const industryProgress = Object.values(targetsByIndustry);

    // Get calls data for the last 7 days
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const callsByDay = await Call.aggregate<DailyCallStats>([
      {
        $match: {
          targetId: { $in: targetIds },
          startTime: { $gte: threeMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          totalCalls: { $sum: 1 },
          successfulCalls: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format data for response
    const dashboardData: DashboardData = {
      stats: {
        totalTargets: {
          current: currentTargets,
          change: targetsChange,
        },
        completedTargets: {
          current: currentCompletedTargets,
          change: completedTargetsChange,
        },
        pendingTargets: {
          current: currentPendingTargets,
          change: pendingTargetsChange,
        },
        conversionRate: {
          current: currentConversionRate,
          change: conversionRateChange,
        },
      },
      industryProgress,
      callsData: {
        labels: callsByDay.map((day) => day._id),
        datasets: [
          {
            label: "Total Calls",
            data: callsByDay.map((day) => day.totalCalls),
          },
          {
            label: "Successful Calls",
            data: callsByDay.map((day) => day.successfulCalls),
          },
        ],
      },
      projects,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
