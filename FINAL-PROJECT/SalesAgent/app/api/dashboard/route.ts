import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Lead, Campaign, Call } from "@/models";
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

    // Get admin's campaigns with aggregated data
    const campaigns = await Campaign.aggregate([
      {
        $match: {
          adminId: new mongoose.Types.ObjectId(session.user.id),
        },
      },
      {
        $lookup: {
          from: "leads",
          localField: "_id",
          foreignField: "campaignId",
          as: "campaignLeads",
        },
      },
      {
        $lookup: {
          from: "calls",
          localField: "campaignLeads._id",
          foreignField: "leadId",
          as: "campaignCalls",
        },
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          leads: { $size: "$campaignLeads" },
          calls: { $size: "$campaignCalls" },
          conversion: {
            $concat: [
              {
                $toString: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $cond: [
                            { $eq: [{ $size: "$campaignCalls" }, 0] },
                            0,
                            {
                              $divide: [
                                {
                                  $size: {
                                    $filter: {
                                      input: "$campaignLeads",
                                      as: "lead",
                                      cond: {
                                        $eq: ["$$lead.status", "closed"],
                                      },
                                    },
                                  },
                                },
                                { $size: "$campaignLeads" },
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

    // Get all leads for admin's campaigns
    const adminCampaigns = await Campaign.find({
      adminId: new mongoose.Types.ObjectId(session.user.id),
    });

    const campaignIds = adminCampaigns.map((campaign) => campaign._id);

    const leads = await Lead.find({
      campaignId: { $in: campaignIds },
    });

    const leadIds = leads.map((lead) => lead._id);

    const lastWeekLeads = await Lead.find({
      campaignId: { $in: campaignIds },
      lastContact: {
        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Calculate stats
    const currentLeads = leads.length;
    const previousLeads = lastWeekLeads.length;
    const leadsChange = ((currentLeads - previousLeads) / previousLeads) * 100;

    const currentClosedLeads = leads.filter(
      (lead) => lead.status === "closed"
    ).length;
    const previousClosedLeads = lastWeekLeads.filter(
      (lead) => lead.status === "closed"
    ).length;
    const closedLeadsChange =
      ((currentClosedLeads - previousClosedLeads) / previousClosedLeads) * 100;

    const currentPendingLeads = leads.filter(
      (lead) => lead.status !== "failed" && lead.status !== "closed"
    ).length;
    const previousPendingLeads = lastWeekLeads.filter(
      (lead) => lead.status !== "failed" && lead.status !== "closed"
    ).length;
    const pendingLeadsChange =
      ((currentPendingLeads - previousPendingLeads) / previousPendingLeads) *
      100;

    const currentConversionRate =
      currentLeads > 0
        ? Math.round((currentClosedLeads / currentLeads) * 100)
        : 0;
    const pastConversionRate =
      previousLeads > 0
        ? Math.round((previousClosedLeads / previousLeads) * 100)
        : 0;
    const conversionRateChange =
      (currentConversionRate - pastConversionRate) / pastConversionRate;
    // Group leads by industry for progress tracking
    const leadsByIndustry = leads.reduce<Record<string, IndustryProgress>>(
      (acc, lead) => {
        if (!acc[lead.industry]) {
          acc[lead.industry] = {
            total: 0,
            closed: 0,
            name: lead.industry,
            progress: 0,
          };
        }
        acc[lead.industry].total++;
        if (lead.status === "closed") {
          acc[lead.industry].closed++;
          acc[lead.industry].progress = Math.round(
            (acc[lead.industry].closed / acc[lead.industry].total) * 100
          );
        }
        return acc;
      },
      {}
    );

    // Calculate industry progress
    const industryProgress = Object.values(leadsByIndustry);

    // Get calls data for the last 7 days
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const callsByDay = await Call.aggregate<DailyCallStats>([
      {
        $match: {
          leadId: { $in: leadIds },
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
        totalLeads: {
          current: currentLeads,
          change: leadsChange,
        },
        closedLeads: {
          current: currentClosedLeads,
          change: closedLeadsChange,
        },
        pendingLeads: {
          current: currentPendingLeads,
          change: pendingLeadsChange,
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
      campaigns,
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
