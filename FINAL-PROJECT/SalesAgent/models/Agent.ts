import mongoose, { ObjectId, Schema } from "mongoose";

export interface IAgent {
  agentId: string;
  projectId: ObjectId;
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
