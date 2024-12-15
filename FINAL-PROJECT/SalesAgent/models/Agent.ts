import mongoose, { Schema } from "mongoose";

export interface IAgent {
  agentId: string;
  projectId: mongoose.Types.ObjectId;
}

const AgentSchema = new Schema<IAgent>(
  {
    agentId: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Agent ||
  mongoose.model<IAgent>("Agent", AgentSchema);
