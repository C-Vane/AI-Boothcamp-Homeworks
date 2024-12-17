"use client";

import { useEffect, useState } from "react";

import { ICampaign } from "@/models/Campaign";
import { IAgent } from "@/models/Agent";
import { ITarget } from "@/models/Target";
import { GetAgentResponseModel } from "elevenlabs/api";
import { ObjectId } from "mongoose";

export interface CampaignWithRelations extends ICampaign {
  agents?: Array<IAgent & GetAgentResponseModel>;
  targets?: ITarget[];
}

export interface PaginationState {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export const useCampaign = (campaignId: string) => {
  const [campaign, setCampaign] = useState<CampaignWithRelations>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Fetch campaigns
        const campaignsResponse = await fetch(`/api/campaign/${campaignId}`);
        const campaignsData = await campaignsResponse.json();

        setCampaign(campaignsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch campaigns and related data");
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [campaignId]);

  return {
    campaign,
    loading,
    error,
  };
};

export function useCampaignTargets(campaignId: ObjectId) {
  const [targets, setTargets] = useState<ITarget[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          search,
          status,
        });

        const response = await fetch(
          `/api/campaign/${campaignId}/targets?${queryParams}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch targets");
        }

        const data = await response.json();
        setTargets(data.targets);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTargets();
  }, [campaignId, pagination.page, pagination.limit, search, status]);

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (newStatus: string) => {
    setStatus(newStatus);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    targets,
    pagination,
    isLoading,
    error,
    setPage,
    setLimit,
    handleSearch,
    handleStatusFilter,
    search,
    status,
  };
}
