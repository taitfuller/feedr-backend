import { Collection, Db, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { IReview } from "../../models";
import { getReviewSummary, removeTopic, setFlag } from "../review";

let db: Db;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__ + global.__MONGO_DB_NAME__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: false,
  });
  db = mongoose.connection.db;
});

let reviewColl: Collection<IReview>;

beforeEach(async () => {
  reviewColl = await db.createCollection("reviews");
});

afterEach(async () => {
  await reviewColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const mockReviews = [
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f57"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 13),
    platform: "iOS",
    type: "featureRequest",
    rating: 5,
    text: "A really cool day to have a birthday",
    flag: false,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f58"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 16),
    platform: "Android",
    type: "featureRequest",
    rating: 3,
    text: "An awesome day to have a birthday",
    flag: true,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3c"),
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f59"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 17),
    platform: "iOS",
    type: "bugReport",
    rating: 4,
    text: "A terrible day to have a birthday",
    flag: false,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f60"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 14),
    platform: "Android",
    type: "other",
    rating: 1,
    text: "An other day to have a birthday",
    flag: false,
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f61"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 7, 28),
    platform: "iOS",
    type: "bugReport",
    rating: 2,
    text: "An early day to have a birthday",
    flag: false,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3d"),
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f62"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 4, 28),
    platform: "Android",
    type: "other",
    rating: 3,
    text: "An earlier day to have a birthday",
    flag: false,
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f63"),
    feed: new ObjectId("614d3961fc9e3d5748ddd429"),
    date: new Date(2021, 4, 28),
    platform: "Android",
    type: "other",
    rating: 3,
    text: "A review in a different feed",
    flag: false,
  },
] as unknown as IReview[];

describe("services/review.ts", () => {
  describe("setFlag()", () => {
    it("Sets flag to true if flag not provided", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await setFlag("613c4a59b9e08b7a26724f57");
      expect(review?.flag).toBeTruthy();

      const reviews = await reviewColl.find().toArray();
      expect(reviews[0].flag).toBeTruthy();
      expect(reviews[1].flag).toBeTruthy();
      expect(reviews[2].flag).toBeFalsy();
    });

    it("Sets flag to true if flag is undefined", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await setFlag("613c4a59b9e08b7a26724f57", undefined);
      expect(review?.flag).toBeTruthy();

      const reviews = await reviewColl.find().toArray();
      expect(reviews[0].flag).toBeTruthy();
      expect(reviews[1].flag).toBeTruthy();
      expect(reviews[2].flag).toBeFalsy();
    });

    it("Sets flag to true if flag is true", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await setFlag("613c4a59b9e08b7a26724f57", true);
      expect(review?.flag).toBeTruthy();

      const reviews = await reviewColl.find().toArray();
      expect(reviews[0].flag).toBeTruthy();
      expect(reviews[1].flag).toBeTruthy();
      expect(reviews[2].flag).toBeFalsy();
    });

    it("Sets flag to false if flag is false", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await setFlag("613c4a59b9e08b7a26724f58", false);
      expect(review?.flag).toBeFalsy();

      const reviews = await reviewColl.find().toArray();
      expect(reviews[0].flag).toBeFalsy();
      expect(reviews[1].flag).toBeFalsy();
      expect(reviews[2].flag).toBeFalsy();
    });

    it("Returns null if no review found with specified id", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await setFlag("613c4a59b9e08b7a26724f70");
      expect(review).toBeNull();
    });
  });

  describe("removeTopic()", () => {
    it("Removes topic from review", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await removeTopic("613c4a59b9e08b7a26724f57");
      expect(review?.topicId).toBeUndefined();

      const reviews = await reviewColl.find().toArray();
      expect(reviews[0]?.topicId).toBeUndefined();
      expect(reviews[1]?.topicId).toBeDefined();
      expect(reviews[2]?.topicId).toBeDefined();
    });

    it("Returns null if no review found with specified id", async () => {
      await reviewColl.insertMany(mockReviews);

      const review = await removeTopic("613c4a59b9e08b7a26724f70");
      expect(review).toBeNull();
    });
  });

  describe("getReviewSummary()", () => {
    it("Gets review summary", async () => {
      await reviewColl.insertMany(mockReviews);

      const summary = await getReviewSummary(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9)
      );

      expect(summary.featureRequests).toBe(2);
      expect(summary.bugReports).toBe(1);
      expect(summary.other).toBe(1);
      expect(summary.oldReviews).toBe(2);
      expect(summary.topics).toBe(2);
      expect(summary.averageRating).toBe(3.25);
    });

    it("Returns zeros if no matching reviews", async () => {
      const summary = await getReviewSummary(
        "614d3961fc9e3d5748ddd428",
        new Date(1970),
        new Date(2021, 8, 11)
      );

      expect(summary.featureRequests).toBe(0);
      expect(summary.bugReports).toBe(0);
      expect(summary.other).toBe(0);
      expect(summary.oldReviews).toBe(0);
      expect(summary.topics).toBe(0);
      expect(summary.averageRating).toBe(0);
    });
  });
});
