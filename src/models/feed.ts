import { ObjectId } from "mongodb";
import { model, Model, Schema } from "mongoose";

export interface IFeed {
  readonly _id: ObjectId;
  readonly appName: string;
  readonly repoName: string;
}

const feedSchema = new Schema<IFeed, Model<IFeed>, IFeed>({
  appName: { type: String, required: true },
  repoName: { type: String, required: true },
});

export default model<IFeed>("Feed", feedSchema);
