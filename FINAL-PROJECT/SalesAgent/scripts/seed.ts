import "dotenv/config";
import { Lead, Campaign, Agent, User, Call } from "../models";
import dbConnect from "../lib/db/connect";
import { Personality } from "@/lib/prompts/agentPrompt";
import { Language } from "@/types/languages";

import bcrypt from "bcryptjs";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const statuses = ["scheduled", "scheduled", "completed", "failed"];
const languages = ["en", "es", "fr", "de", "it"] as Language[];
const personalities = Object.values(Personality);

async function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    await Lead.deleteMany({});
    await Campaign.deleteMany({});
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

    // Create some campaigns
    const campaigns = await Campaign.create([
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

    const agentIds = [
      "oDFg5gmdDaDSB7m3iNcz",
      "mAqBdobfGNNYnyTGZRFa",
      "6zAXNr0xfisy4Le4o0NA",
    ];

    // Create agents for each campaign
    const agents = await Promise.all(
      campaigns.map(async (campaign, index) => {
        return Agent.create({
          agentId: agentIds[index],
          campaignId: campaign._id,
          personality:
            personalities[Math.floor(Math.random() * personalities.length)],
          resources: [
            "Product brochure",
            "Technical documentation",
            "Case studies",
          ],
        });
      })
    );

    // Generate leads and calls for each campaign
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const agent = agents[i];
      const leadsCount = Math.floor(Math.random() * 20) + 10; // 10-30 leads per campaign

      for (let j = 0; j < leadsCount; j++) {
        const industry =
          industries[Math.floor(Math.random() * industries.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const lastContact = await generateRandomDate(sevenDaysAgo, new Date());

        const lead = await Lead.create({
          name: `Contact ${j + 1}`,
          company: `Company ${j + 1}`,
          position: ["CEO", "CTO", "Sales Director", "Manager"][
            Math.floor(Math.random() * 4)
          ],
          industry,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          email: `contact${j + 1}@company${j + 1}.com`,
          status,
          bestTimeToCall: "9:00-17:00",
          timezone: "UTC",
          lastContact: status !== "scheduled" ? lastContact : null,
          notes: "Initial contact to be made",
          campaignId: campaign._id,
          agentId: agent._id,
          language: languages[Math.floor(Math.random() * languages.length)],
        });

        // Generate 1-3 calls for each lead that's not scheduled
        if (status !== "scheduled") {
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
                speaker: lead.name,
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
                status: "todo",
              },
              {
                task: "Send product documentation",
                priority: "medium",
                status: "todo",
              },
            ];

            await Call.create({
              conversationId: "9kXbhoBJlYQQDActat8E",
              agentId: agent.agentId,
              leadId: lead._id,
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
