import { ObjectId } from "mongodb";
import { model, Model, Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";
import config from "../config";

export interface IUser {
  readonly _id: ObjectId;
  readonly githubId: number;
  readonly displayName: string;
  readonly githubAccessToken: string;
}

const topicSchema = new Schema<IUser, Model<IUser>, IUser>({
  githubId: { type: Number, required: true, unique: true },
  displayName: { type: String, required: true },
  githubAccessToken: String,
});

topicSchema.plugin(fieldEncryption, {
  fields: ["githubAccessToken"],
  secret: config.get("encryption_secret"),
});

export default model<IUser>("User", topicSchema);
