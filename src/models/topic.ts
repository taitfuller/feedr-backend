import { ObjectId } from "mongodb";
import { model, Model, Schema } from "mongoose";

export interface ITopic {
  _id: ObjectId;
  keywords: string[];
  summary: string;
  category: "PROBLEM" | "INQUIRY";
}

const topicSchema = new Schema<ITopic, Model<ITopic>, ITopic>({
  keywords: [String],
  summary: { type: String, required: true },
  category: { type: String, enum: ["PROBLEM", "INQUIRY"], required: true },
});

export default model<ITopic>("Topic", topicSchema);
