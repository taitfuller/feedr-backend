import { ObjectId } from "mongodb";
import { model, Model, Schema } from "mongoose";
import { IReview } from "./";

export interface ITopic {
  _id: ObjectId;
  keywords: string[];
  summary: string;
  category: "PROBLEM" | "INQUIRY";
  reviews?: IReview[];
}

const topicSchema = new Schema<ITopic, Model<ITopic>, ITopic>({
  keywords: [String],
  summary: { type: String, required: true },
  category: { type: String, enum: ["PROBLEM", "INQUIRY"], required: true },
});
topicSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "topicId",
});

export default model<ITopic>("Topic", topicSchema);
