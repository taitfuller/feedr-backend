import { ObjectId } from "mongodb";
import { model, Model, PopulatedDoc, Schema } from "mongoose";
import { fieldEncryption } from "mongoose-field-encryption";
import config from "../config";
import { IFeed } from "./index";

export interface IUser {
  readonly _id: ObjectId;
  readonly githubId: number;
  readonly displayName: string;
  readonly githubAccessToken: string;
  readonly feeds: PopulatedDoc<IFeed[]>;
}

const topicSchema = new Schema<IUser, Model<IUser>, IUser>({
  githubId: { type: Number, required: true, unique: true },
  displayName: { type: String, required: true },
  githubAccessToken: String,
  feeds: { type: [{ type: Schema.Types.ObjectId, ref: "Feed" }] },
});

topicSchema.plugin(fieldEncryption, {
  fields: ["githubAccessToken"],
  secret: config.get("encryption_secret"),
});

export default model<IUser>("User", topicSchema);
