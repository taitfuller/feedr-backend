import mongoose from "mongoose";
import { Collection, Db, ObjectId } from "mongodb";
import { IReview, ITopic } from "../../models";
import { getSummaryByTopic, getTopic, getTopics } from "../topic";

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
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 13),
    platform: "iOS",
    rating: 5,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 16),
    platform: "Android",
    rating: 1,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3c"),
  },
  {
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 17),
    platform: "iOS",
    rating: 3,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 11),
    platform: "Android",
    rating: 4,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    date: new Date(2021, 8, 9),
    platform: "iOS",
    rating: 3,
    topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
  },
  {
    feed: new ObjectId("614d3961fc9e3d5748ddd429"),
    date: new Date(2021, 8, 9),
    platform: "iOS",
    rating: 3,
    text: "A review in a different feed",
    topicId: new ObjectId("613c4a58b9e08b7a26724f3f"),
  },
] as unknown as IReview[];

const mockTopics = [
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3b"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    keywords: ["cool", "birthday"],
    summary: "A really cool day to have a birthday",
    type: "featureRequest",
  },
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3c"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    keywords: ["awesome", "birthday"],
    summary: "An awesome day to have a birthday",
    type: "featureRequest",
  },
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3d"),
    feed: new ObjectId("614d3961fc9e3d5748ddd428"),
    keywords: ["terrible", "birthday"],
    summary: "A terrible day to have a birthday",
    type: "bugReport",
  },
  {
    _id: new ObjectId("613c4a58b9e08b7a26724f3e"),
    feed: new ObjectId("614d3961fc9e3d5748ddd429"),
    keywords: ["terrible", "birthday"],
    summary: "A topic in a different feed",
    type: "bugReport",
  },
] as ITopic[];

describe("services/topic.ts", () => {
  describe("getTopics()", () => {
    it("Gets all topics within date range", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 8, 16),
        ["iOS", "Android"]
      );

      expect(topics).toHaveLength(2);
      expect(topics[0].summary).toBe("A really cool day to have a birthday");
      expect(topics[1].summary).toBe("An awesome day to have a birthday");
    });

    it("Populates up to 3 reviews for all topics", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 8, 16),
        ["iOS", "Android"]
      );

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(3);
      expect(topics[1].reviews).toHaveLength(1);
    });

    it("Populates reviews within date range", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8, 11),
        new Date(2021, 8, 16),
        ["iOS", "Android"]
      );

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(2);
      expect(topics[1].reviews).toHaveLength(1);
    });

    it("Populates iOS reviews", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["iOS"]
      );

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(3);
      expect(topics[1].reviews).toHaveLength(0);
    });

    it("Populates Android reviews", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["Android"]
      );

      expect(topics).toHaveLength(2);
      expect(topics[0].reviews).toHaveLength(1);
      expect(topics[1].reviews).toHaveLength(1);
    });

    it("Sorts populated reviews by date descending", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topics = await getTopics(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["iOS", "Android"]
      );

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
      expect(topic?.type).toBe("featureRequest");
    });

    it("Populated reviews for topic with specified id", async () => {
      await reviewColl.insertMany(mockReviews);
      await topicColl.insertMany(mockTopics);

      const topic = await getTopic("613c4a58b9e08b7a26724f3b");

      expect(topic?.reviews).toHaveLength(4);
    });

    it("Returns null if no topic found with specified id", async () => {
      await topicColl.insertMany(mockTopics);

      const topic = await getTopic("613c4a58b9e08b7a26724f3f");

      expect(topic).toBeNull();
    });
  });

  describe("getSummaryByTopic()", () => {
    it("Gets summaries by topic", async () => {
      await reviewColl.insertMany(mockReviews);

      const summaryByTopic = await getSummaryByTopic(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8, 10),
        new Date(2021, 8, 16),
        ["iOS", "Android"]
      );

      expect(summaryByTopic.size).toBe(2);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.newReviews).toBe(
        2
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.oldReviews).toBe(
        1
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.averageRating
      ).toBe(4.5);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3c")?.newReviews).toBe(
        1
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3c")?.oldReviews).toBe(
        0
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3c")?.averageRating
      ).toBe(1);
    });

    it("Gets summaries by topic for iOS", async () => {
      await reviewColl.insertMany(mockReviews);

      const summaryByTopic = await getSummaryByTopic(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["iOS"]
      );

      expect(summaryByTopic.size).toBe(1);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.newReviews).toBe(
        3
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.oldReviews).toBe(
        0
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.averageRating
      ).toBe(11 / 3);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3c")).toBeUndefined();
    });

    it("Gets summaries by topic for Android", async () => {
      await reviewColl.insertMany(mockReviews);

      const summaryByTopic = await getSummaryByTopic(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["Android"]
      );

      expect(summaryByTopic.size).toBe(2);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.newReviews).toBe(
        1
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.oldReviews).toBe(
        0
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.averageRating
      ).toBe(4);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3c")?.newReviews).toBe(
        1
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3c")?.oldReviews).toBe(
        0
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3c")?.averageRating
      ).toBe(1);
    });

    it("Returns empty map if no matching reviews", async () => {
      const summaryByTopic = await getSummaryByTopic(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["iOS", "Android"]
      );

      expect(summaryByTopic.size).toBe(0);
    });

    it("Returns zeros for no matching new reviews", async () => {
      await reviewColl.insertOne({
        feed: new ObjectId("614d3961fc9e3d5748ddd428"),
        date: new Date(2021, 7, 9),
        platform: "iOS",
        rating: 3,
        topicId: new ObjectId("613c4a58b9e08b7a26724f3b"),
      } as unknown as IReview);

      const summaryByTopic = await getSummaryByTopic(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["iOS", "Android"]
      );

      expect(summaryByTopic.size).toBe(1);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.newReviews).toBe(
        0
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.oldReviews).toBe(
        1
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.averageRating
      ).toBe(0);
    });

    it("Returns zero for no matching old reviews", async () => {
      await reviewColl.insertOne(mockReviews[0]);

      const summaryByTopic = await getSummaryByTopic(
        "614d3961fc9e3d5748ddd428",
        new Date(2021, 8),
        new Date(2021, 9),
        ["iOS", "Android"]
      );

      expect(summaryByTopic.size).toBe(1);
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.newReviews).toBe(
        1
      );
      expect(summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.oldReviews).toBe(
        0
      );
      expect(
        summaryByTopic.get("613c4a58b9e08b7a26724f3b")?.averageRating
      ).toBe(5);
    });
  });
});
