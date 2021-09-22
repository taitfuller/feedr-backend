import { ObjectId } from "mongodb";
import { model, Model, Schema } from "mongoose";

export interface IUser {
  readonly _id: ObjectId;
  readonly githubId: number;
  displayName: string;
}

const topicSchema = new Schema<IUser, Model<IUser>, IUser>({
  githubId: { type: Number, required: true, unique: true },
  displayName: { type: String, required: true },
});

export default model<IUser>("User", topicSchema);
