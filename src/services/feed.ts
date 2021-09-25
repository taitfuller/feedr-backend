import mongoose from "mongoose";
import { Feed, IReview, ITopic, User } from "../models";

interface IAppReview {
  date: Date;
  platform: "iOS" | "Android";
  type: "bugReport" | "featureRequest" | "other";
  rating: number;
  text: string;
  flag: boolean;
}

interface IApp {
  _id: string;
  topics: {
    keywords: string[];
    summary: string;
    type: "bugReport" | "featureRequest";
    reviews: IAppReview[];
  }[];
  otherReviews: IAppReview[];
}

export const getApps = async (): Promise<string[]> => {
  const db = mongoose.connection.db;

  const apps = await db.collection<IApp>("apps").find().toArray();

  return apps.map((app) => app._id);
};

export const createFeed = async (
  appName: string,
  repoName: string,
  userId: string
): Promise<string | null> => {
  const db = mongoose.connection.db;

  const app = await db.collection<IApp>("apps").findOne({ _id: appName });

  if (!app) return null;

  const feed = await Feed.create({ appName, repoName });
  await User.findByIdAndUpdate(userId, { $push: { feeds: feed._id } });

  const topicsColl = await db.collection<Omit<ITopic, "reviews">>("topics");
  const reviewsColl = await db.collection<IReview>("reviews");

  await topicsColl.insertMany(
    app.topics.map((topic) => ({ ...topic, feed: feed._id }))
  );

  const promises: Promise<unknown>[] = app.topics.map(async (topic) => {
    const { insertedId: topicId } = await topicsColl.insertOne({
      feed: feed._id,
      keywords: topic.keywords,
      summary: topic.summary,
      type: topic.type,
    });
    await reviewsColl.insertMany(
      topic.reviews.map((review) => ({ ...review, feed: feed._id, topicId }))
    );
  });

  promises.push(
    (async () =>
      reviewsColl.insertMany(
        app.otherReviews.map((review) => ({ ...review, feed: feed._id }))
      ))()
  );

  await Promise.all(promises);

  return feed._id.toString();
};
