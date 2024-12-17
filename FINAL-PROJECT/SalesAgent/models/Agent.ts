import mongoose, { ObjectId, Schema } from "mongoose";
import { Personality } from "@/lib/prompts/agentPrompt";

export interface IAgent {
  agentId: string;
  campaignId: ObjectId;
  resources: string[];
  personality?: Personality;
}

const AgentSchema = new Schema<IAgent>(
  {
    agentId: { type: String, required: true, unique: true, select: true },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    resources: { type: [String], required: false },
    personality: { type: String, enum: Personality, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Agent ||
  mongoose.model<IAgent>("Agent", AgentSchema);
