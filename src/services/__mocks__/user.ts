import { ObjectId } from "mongodb";

export const getUser = jest.fn(() => ({
  _id: new ObjectId("61495e3fb656d914455a2a38"),
  githubId: 1234,
  displayName: "testuser",
}));
