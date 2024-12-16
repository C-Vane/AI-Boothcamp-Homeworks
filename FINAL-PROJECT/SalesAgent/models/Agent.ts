import mongoose, { Schema } from "mongoose";

export interface IAgent {
  agentId: string;
  projectId: mongoose.Types.ObjectId;
  resources: string[];
}

const AgentSchema = new Schema<IAgent>(
  {
    agentId: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    resources: { type: [String], required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Agent ||
  mongoose.model<IAgent>("Agent", AgentSchema);
