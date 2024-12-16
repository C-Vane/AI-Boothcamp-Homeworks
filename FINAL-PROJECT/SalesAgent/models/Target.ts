import mongoose, { Schema } from "mongoose";

export interface ITarget {
  _id: string;
  name: string;
  company: string;
  position: string;
  industry: string;
  phone: string;
  email: string;
  status: "pending" | "contacted" | "scheduled" | "completed" | "failed";
  bestTimeToCall: string;
  timezone: string;
  lastContact: Date;
  notes: string;
  contactInCommon: string;
  projectId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TargetSchema = new Schema<ITarget>(
  {
    name: { type: String, required: true },
    company: { type: String },
    position: { type: String },
    industry: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    status: {
      type: String,
      enum: ["pending", "contacted", "scheduled", "completed", "failed"],
      default: "pending",
    },
    bestTimeToCall: { type: String },
    timezone: { type: String },
    lastContact: { type: Date },
    notes: { type: String },
    contactInCommon: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    agentId: { type: Schema.Types.ObjectId, ref: "Agent" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Target ||
  mongoose.model<ITarget>("Target", TargetSchema);
