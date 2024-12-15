import mongoose, { Schema } from "mongoose";

interface ITranscriptEntry {
  timestamp: Date;
  speaker: string;
  text: string;
}

interface ITodoItem {
  task: string;
  priority: string;
  status: string;
}

export interface ICall {
  targetId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number;
  transcript: ITranscriptEntry[];
  summary: string;
  todoItems: ITodoItem[];
  status: "completed" | "failed" | "scheduled";
}

const CallSchema = new Schema<ICall>(
  {
    targetId: { type: Schema.Types.ObjectId, ref: "Target", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number },
    transcript: [
      {
        timestamp: { type: Date, required: true },
        speaker: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    summary: { type: String },
    todoItems: [
      {
        task: { type: String, required: true },
        priority: { type: String, required: true },
        status: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["completed", "failed", "scheduled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Call ||
  mongoose.model<ICall>("Call", CallSchema);
