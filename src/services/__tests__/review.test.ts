import { Collection, Db, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { IReview } from "../../models";
import { removeTopic, setFlag } from "../review";

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
    date: new Date(2021, 8, 13),
    platform: "iOS",
    category: "INQUIRY",
    text: "A really cool day to have a birthday",
    flag: false,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f58"),
    date: new Date(2021, 8, 16),
    platform: "Android",
    category: "INQUIRY",
    text: "An awesome day to have a birthday",
    flag: true,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3c"),
  },
  {
    _id: new ObjectId("613c4a59b9e08b7a26724f59"),
    date: new Date(2021, 8, 17),
    platform: "iOS",
    category: "PROBLEM",
    text: "A terrible day to have a birthday",
    flag: false,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
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

      const review = await setFlag("613c4a59b9e08b7a26724f60");
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

      const review = await removeTopic("613c4a59b9e08b7a26724f60");
      expect(review).toBeNull();
    });
  });
});
