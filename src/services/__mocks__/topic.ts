import { TopicSummary } from "../topic";
import { ObjectId } from "mongodb";

export const getTopics = jest.fn(() => [
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3b"),
    keywords: ["cool", "birthday"],
    summary: "A really cool day to have a birthday",
    type: "featureRequest",
    reviews: [
      {
        _id: new ObjectId("613c4a59b9e08b7a26724f57"),
        date: new Date(2021, 8, 13),
        platform: "iOS",
        type: "featureRequest",
        rating: 5,
        text: "A really cool day to have a birthday",
        flag: false,
        topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
      },
      {
        _id: new ObjectId("613c4a59b9e08b7a26724f59"),
        date: new Date(2021, 8, 1),
        platform: "iOS",
        type: "bugReport",
        rating: 4,
        text: "A terrible day to have a birthday",
        flag: false,
        topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
      },
    ],
  },
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3c"),
    keywords: ["awesome", "birthday"],
    summary: "An awesome day to have a birthday",
    type: "featureRequest",
    reviews: [
      {
        _id: new ObjectId("613c4a59b9e08b7a26724f58"),
        date: new Date(2021, 8, 16),
        platform: "Android",
        type: "featureRequest",
        rating: 3,
        text: "An awesome day to have a birthday",
        flag: true,
        topicId: new ObjectId("613c4a58b9e08b7a26724f3c"),
      },
    ],
  },
]);

export const getTopic = jest.fn(() => ({
  _id: new ObjectId("613c4a58b9e08b7a26724f3b"),
  keywords: ["cool", "birthday"],
  summary: "A really cool day to have a birthday",
  type: "featureRequest",
  reviews: [
    {
      _id: new ObjectId("613c4a59b9e08b7a26724f57"),
      date: new Date(2021, 8, 13),
      platform: "iOS",
      type: "featureRequest",
      rating: 5,
      text: "A really cool day to have a birthday",
      flag: false,
      topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
    },
    {
      _id: new ObjectId("613c4a59b9e08b7a26724f59"),
      date: new Date(2021, 8, 17),
      platform: "iOS",
      type: "bugReport",
      rating: 4,
      text: "A terrible day to have a birthday",
      flag: false,
      topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
    },
  ],
}));

export const getSummaryByTopic = jest.fn(
  () =>
    new Map<string, TopicSummary>([
      [
        "613c4a58b9e08b7a26724f3b",
        {
          newReviews: 1,
          increase: 1,
          averageRating: 5,
        },
      ],
      [
        "613c4a58b9e08b7a26724f3c",
        {
          newReviews: 1,
          increase: undefined,
          averageRating: 3,
        },
      ],
    ])
);
