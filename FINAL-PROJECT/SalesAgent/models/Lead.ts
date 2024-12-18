import { Language } from "@/types/languages";
import mongoose, { ObjectId, Schema } from "mongoose";

export enum LeadsEnum {
  new = "new",
  contacted = "contacted",
  responded = "responded",
  scheduled = "scheduled",
  closed = "closed",
  failed = "failed",
}
export interface ILead {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  industry: string;
  timezone: string;
  language: Language;
  notes: string;
  contactInCommon: string;
  lastContact: Date;
  status: "new" | "contacted" | "responded" | "scheduled" | "closed" | "failed";
  campaignId: ObjectId;
  agentId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    position: { type: String },
    industry: { type: String },
    timezone: { type: String },
    language: { type: String, default: "en", required: true },
    notes: { type: String },
    contactInCommon: { type: String },
    lastContact: { type: Date },
    status: {
      type: String,
      enum: LeadsEnum,
      default: "new",
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    agentId: { type: String, ref: "Agent" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Lead ||
  mongoose.model<ILead>("Lead", LeadSchema);
