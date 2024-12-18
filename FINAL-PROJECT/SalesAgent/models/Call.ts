import mongoose, { ObjectId, Schema } from "mongoose";

interface ITranscriptEntry {
  timestamp: Date;
  speaker: string;
  text: string;
}

interface ITodoItem {
  task: string;
  status: string;
}

export interface ICall {
  conversationId: string;
  agentId: string;
  leadId: ObjectId;
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
    conversationId: { type: String, required: true },
    agentId: { type: String, ref: "Agent", required: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
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
        status: {
          type: String,
          enum: ["completed", "in-progress", "todo"],
          default: "todo",
        },
      },
    ],
    status: {
      type: String,
      enum: ["completed", "failed", "scheduled", "started"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Call ||
  mongoose.model<ICall>("Call", CallSchema);
