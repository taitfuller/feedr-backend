import { model, Schema } from "mongoose";

export interface IExample extends Document {
  name: string;
}

const exampleSchema = new Schema({
  name: String,
});

export default model<IExample>("Example", exampleSchema);
