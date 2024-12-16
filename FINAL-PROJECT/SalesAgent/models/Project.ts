import mongoose, { ObjectId, Schema } from "mongoose";

export interface IProject {
  _id: ObjectId;
  name: string;
  description: string;
  logo: string;
  industry: string;
  adminId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
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

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
