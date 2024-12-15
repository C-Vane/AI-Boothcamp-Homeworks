import "dotenv/config";
import { Target, Project, Agent, User, Call } from "../models";
import dbConnect from "../lib/db/connect";

import bcrypt from "bcryptjs";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const statuses = ["pending", "scheduled", "completed", "failed"];

async function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    await Target.deleteMany({});
    await Project.deleteMany({});
    await Agent.deleteMany({});
    await User.deleteMany({});
    await Call.deleteMany({});

    // Create a test admin user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const admin = await User.create({
      name: "Test Admin",
      email: "admin@test.com",
      password: hashedPassword,
    });

    // Create some projects
    const projects = await Project.create([
      {
        name: "Tech Startups Campaign",
        description: "Outreach campaign for tech startups",
        industry: "Technology",
        logo: "/logos/tech.png",
        adminId: admin._id,
      },
      {
        name: "Healthcare Solutions",
        description: "Medical software sales campaign",
        industry: "Healthcare",
        logo: "/logos/health.png",
        adminId: admin._id,
      },
      {
        name: "FinTech Innovation",
        description: "Financial technology solutions campaign",
        industry: "Finance",
        logo: "/logos/finance.png",
        adminId: admin._id,
      },
    ]);

    // Create agents for each project
    const agents = await Promise.all(
      projects.map(async (project) => {
        return Agent.create({
          agentId: `mAqBdobfGNNYnyTGZRFa`,
          projectId: project._id,
        });
      })
    );

    // Generate targets and calls for each project
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const agent = agents[i];
      const targetsCount = Math.floor(Math.random() * 20) + 10; // 10-30 targets per project

      for (let j = 0; j < targetsCount; j++) {
        const industry =
          industries[Math.floor(Math.random() * industries.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const lastContact = await generateRandomDate(sevenDaysAgo, new Date());

        const target = await Target.create({
          name: `Contact ${j + 1}`,
          company: `Company ${j + 1}`,
          position: ["CEO", "CTO", "Sales Director", "Manager"][
            Math.floor(Math.random() * 4)
          ],
          industry,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          email: `contact${j + 1}@company${j + 1}.com`,
          status,
          bestTimeToCall: ["Morning", "Afternoon", "Evening"][
            Math.floor(Math.random() * 3)
          ],
          timezone: "UTC",
          lastContact: status !== "pending" ? lastContact : null,
          notes: "Initial contact to be made",
          projectId: project._id,
          agentId: agent._id,
        });

        // Generate 1-3 calls for each target that's not pending
        if (status !== "pending") {
          const numCalls = Math.floor(Math.random() * 3) + 1;
          for (let k = 0; k < numCalls; k++) {
            const callStartTime = await generateRandomDate(
              sevenDaysAgo,
              new Date()
            );
            const callDuration = Math.floor(Math.random() * 900) + 300; // 5-20 minutes in seconds
            const callEndTime = new Date(
              callStartTime.getTime() + callDuration * 1000
            );

            const callStatus = k === numCalls - 1 ? status : "completed";

            // Generate a realistic conversation transcript
            const transcript = [
              {
                timestamp: callStartTime,
                speaker: "Agent",
                text: "Hello, this is AI Sales Agent calling from Codeium. How are you today?",
              },
              {
                timestamp: new Date(callStartTime.getTime() + 5000),
                speaker: target.name,
                text: "I'm doing well, thank you. What can I help you with?",
              },
              {
                timestamp: new Date(callStartTime.getTime() + 10000),
                speaker: "Agent",
                text: "I'm reaching out to discuss how our AI-powered solutions could benefit your business operations.",
              },
            ];

            // Generate todo items based on the call
            const todoItems = [
              {
                task: "Follow up on pricing discussion",
                priority: "high",
                status: "pending",
              },
              {
                task: "Send product documentation",
                priority: "medium",
                status: "pending",
              },
            ];

            await Call.create({
              targetId: target._id,
              startTime: callStartTime,
              endTime: callEndTime,
              duration: callDuration,
              transcript,
              summary:
                "Discussed AI solutions and potential implementation. Client showed interest in pricing details.",
              todoItems,
              status: callStatus,
            });
          }
        }
      }
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
