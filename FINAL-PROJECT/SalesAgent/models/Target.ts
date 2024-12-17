import { Language } from "@/types/languages";
import mongoose, { ObjectId, Schema } from "mongoose";

export interface ITarget {
  _id: ObjectId;
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
  campaignId: ObjectId;
  agentId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  language: Language;
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
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    agentId: { type: String, ref: "Agent" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    language: { type: String, default: "en", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Target ||
  mongoose.model<ITarget>("Target", TargetSchema);
