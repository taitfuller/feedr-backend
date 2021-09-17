import { ObjectId } from "mongodb";
import { model, Model, Schema } from "mongoose";
import { IReview } from "./";

export interface ITopic {
  _id: ObjectId;
  keywords: string[];
  summary: string;
  type: "bugReport" | "featureRequest";
  reviews: IReview[];
}

const topicSchema = new Schema<ITopic, Model<ITopic>, ITopic>({
  keywords: [String],
  summary: { type: String, required: true },
  type: {
    type: String,
    enum: ["bugReport", "featureRequest"],
    required: true,
  },
});
topicSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "topicId",
});

export default model<ITopic>("Topic", topicSchema);
