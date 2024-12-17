import mongoose, { ObjectId, Schema } from "mongoose";

export interface ICampaign {
  _id: ObjectId;
  name: string;
  description: string;
  logo: string;
  industry: string;
  adminId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    industry: { type: String },
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);
