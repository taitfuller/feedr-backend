import { ObjectId } from "mongodb";

export const setFlag = jest.fn(() => ({
  _id: new ObjectId("613c4a59b9e08b7a26724f57"),
  date: new Date(2021, 8, 13),
  platform: "iOS",
  category: "INQUIRY",
  rating: 5,
  text: "A really cool day to have a birthday",
  flag: true,
  topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
}));

export const removeTopic = jest.fn(() => ({
  _id: new ObjectId("613c4a59b9e08b7a26724f57"),
  date: new Date(2021, 8, 13),
  platform: "iOS",
  category: "INQUIRY",
  rating: 5,
  text: "A really cool day to have a birthday",
  flag: false,
}));
