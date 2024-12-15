"use client";

import { useEffect, useState } from "react";
import { IProject } from "@/models/Project";
import { IAgent } from "@/models/Agent";
import { ITarget } from "@/models/Target";

interface ProjectWithRelations extends IProject {
  agents?: IAgent[];
  targets?: ITarget[];
}

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Fetch projects
        const projectsResponse = await fetch(`/api/projects/${projectId}`);
        const projectsData = await projectsResponse.json();

        setProject(projectsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch projects and related data");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return {
    project,
    loading,
    error,
  };
};
