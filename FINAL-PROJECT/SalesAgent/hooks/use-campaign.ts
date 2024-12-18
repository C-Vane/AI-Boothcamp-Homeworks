"use client";

import { useEffect, useState } from "react";

import { ICampaign } from "@/models/Campaign";
import { IAgent } from "@/models/Agent";
import { ILead } from "@/models/Lead";
import { GetAgentResponseModel } from "elevenlabs/api";
import { ObjectId } from "mongoose";

export interface CampaignWithRelations extends ICampaign {
  agents?: Array<IAgent & GetAgentResponseModel>;
  leads?: ILead[];
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

export function useCampaignLeads(campaignId: ObjectId) {
  const [leads, setLeads] = useState<ILead[]>([]);
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
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          search,
          status,
        });

        const response = await fetch(
          `/api/campaign/${campaignId}/leads?${queryParams}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();
        setLeads(data.leads);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
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
    leads,
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
