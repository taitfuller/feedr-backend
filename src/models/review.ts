import { Model, model, ObjectId, Schema } from "mongoose";

export interface IReview {
  _id: ObjectId;
  date: Date;
  platform: "iOS" | "Android";
  category: "bugReport" | "featureRequest" | "other";
  text: string;
  flag: boolean;
  topicId?: ObjectId;
}

const reviewSchema = new Schema<IReview, Model<IReview>, IReview>({
  date: { type: Date, required: true },
  platform: {
    type: String,
    enum: ["bugReport", "featureRequest", "other"],
    required: true,
  },
  category: { type: String, enum: ["iOS", "Android"], required: true },
  text: { type: String, required: true },
  flag: { type: Boolean, required: true },
  topicId: { type: Schema.Types.ObjectId },
});

export default model<IReview>("Review", reviewSchema);
