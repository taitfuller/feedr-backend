import mongoose from "mongoose";
import { Collection, Db, ObjectId } from "mongodb";
import { IReview, ITopic } from "../../models";
import { getTopic, getTopics } from "../topic";

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
let topicColl: Collection<ITopic>;

beforeEach(async () => {
  reviewColl = await db.createCollection("reviews");
  topicColl = await db.createCollection("topics");
});

afterEach(async () => {
  await reviewColl.drop();
  await topicColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const mockReviews = [
  {
    date: new Date(2021, 8, 13),
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    date: new Date(2021, 8, 16),
    topicId: new ObjectId("613c4a58b9e08b7a26724f3c"),
  },
  {
    date: new Date(2021, 8, 17),
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    date: new Date(2021, 8, 11),
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    date: new Date(2021, 8, 9),
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
] as unknown as IReview[];

const mockTopics = [
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3b"),
    keywords: ["cool", "birthday"],
    summary: "A really cool day to have a birthday",
    category: "INQUIRY",
  },
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3c"),
    keywords: ["awesome", "birthday"],
    summary: "An awesome day to have a birthday",
    category: "INQUIRY",
  },
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3d"),
    keywords: ["terrible", "birthday"],
    summary: "A terrible day to have a birthday",
    category: "PROBLEM",
  },
] as ITopic[];

describe("services/topic.ts", () => {
  describe("getTopics()", () => {
    it("Gets all topics within date range", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(new Date(2021, 8), new Date(2021, 8, 16));

      expect(topics).toHaveLength(2);
      expect(topics[0].summary).toBe("A really cool day to have a birthday");
      expect(topics[1].summary).toBe("An awesome day to have a birthday");
    });

    it("Populates up to 3 reviews for all topics", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(new Date(2021, 8), new Date(2021, 8, 16));

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(3);
      expect(topics[1].reviews).toHaveLength(1);
    });

    it("Populates reviews within date range", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        new Date(2021, 8, 11),
        new Date(2021, 8, 16)
      );

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(2);
      expect(topics[1].reviews).toHaveLength(1);
    });

    it("Sorts populated reviews by date descending", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(new Date(2021, 8), new Date(2021, 9));

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(3);
      expect(topics[0].reviews?.[0].date).toEqual(new Date(2021, 8, 17));
      expect(topics[0].reviews?.[1].date).toEqual(new Date(2021, 8, 13));
      expect(topics[0].reviews?.[2].date).toEqual(new Date(2021, 8, 11));
    });
  });

  describe("getTopic()", () => {
    it("Gets topic with specified id", async () => {
      await topicColl.insertMany(mockTopics);

      const topic = await getTopic("613c4a58b9e08b7a26724f3c");

      expect(topic?.keywords).toEqual(["awesome", "birthday"]);
      expect(topic?.summary).toEqual("An awesome day to have a birthday");
      expect(topic?.category).toBe("INQUIRY");
    });

    it("Populated reviews for topic with specified id", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topic = await getTopic("613c4a58b9e08b7a26724f3b");

      expect(topic?.reviews).toHaveLength(4);
    });

    it("Returns null if no topic found with specified id", async () => {
      await topicColl.insertMany(mockTopics);

      const topic = await getTopic("613c4a58b9e08b7a26724f3e");

      expect(topic).toBeNull();
    });
  });
});
