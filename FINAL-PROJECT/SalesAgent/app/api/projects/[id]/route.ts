import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import { Project } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { getAgent } from "@/lib/11labs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, description, industry, logo } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create new project
    const project = await Project.create({
      name,
      description,
      industry,
      logo,
      adminId: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    //get project with agents and targets
    const project = await Project.findById(projectId)
      .populate("agents")
      .populate("targets");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get agent details from 11Labs
    const agents = await Promise.all(
      project.agents.map(async (agent) => {
        const agentDetails = await getAgent({
          agentId: agent.agentId,
        });
        return {
          agentId: agent.agentId,
          agentName: agentDetails.name,
          agentImage: agentDetails.image,
          agentStatus: agentDetails.status,
        };
      })
    );

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
