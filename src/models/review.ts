import { ObjectId } from "mongodb";
import { Model, model, Schema } from "mongoose";

export interface IReview {
  _id: ObjectId;
  feed: ObjectId;
  date: Date;
  platform: "iOS" | "Android";
  type: "bugReport" | "featureRequest" | "other";
  text: string;
  flag: boolean;
  topicId?: ObjectId;
}

const reviewSchema = new Schema<IReview, Model<IReview>, IReview>({
  feed: { type: Schema.Types.ObjectId, ref: "Feed" },
  date: { type: Date, required: true },
  platform: {
    type: String,
    enum: ["bugReport", "featureRequest", "other"],
    required: true,
  },
  type: { type: String, enum: ["iOS", "Android"], required: true },
  text: { type: String, required: true },
  flag: { type: Boolean, required: true },
  topicId: { type: Schema.Types.ObjectId },
});

export default model<IReview>("Review", reviewSchema);
