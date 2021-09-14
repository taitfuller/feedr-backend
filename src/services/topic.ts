import { ITopic, Review, Topic } from "../models";
import { ObjectId } from "mongodb";

export const getTopics = async (from: Date, to: Date): Promise<ITopic[]> => {
  const topicIds = await Review.distinct("topicId", {
    date: { $gte: from, $lte: to },
  }).exec();

  return Topic.find({ _id: { $in: topicIds } })
    .populate({
      path: "reviews",
      match: { date: { $gte: from, $lte: to } },
      options: { sort: { date: -1 } },
      perDocumentLimit: 3,
    })
    .lean()
    .exec();
};

export const getTopic = async (id: string): Promise<ITopic | null> => {
  return Topic.findById(id).populate("reviews").lean().exec();
};

type TopicSummary = {
  newReviews: number;
  oldReviews: number;
  averageRating: number;
};

export const getSummaryByTopic = async (
  from: Date,
  to: Date
): Promise<Map<string, TopicSummary>> => {
  const getNewReviews = async (
    from: Date,
    to: Date
  ): Promise<Map<string, number>> => {
    const result: { _id: ObjectId; newReviews: number }[] =
      await Review.aggregate()
        .match({
          date: { $gte: from, $lte: to },
          topicId: { $exists: true },
        })
        .group({ _id: "$topicId", newReviews: { $sum: 1 } })
        .exec();
    return result.reduce(
      (newByTopic, topic) =>
        newByTopic.set(topic._id.toString(), topic.newReviews),
      new Map<string, number>()
    );
  };

  const getOldReviews = async (from: Date): Promise<Map<string, number>> => {
    const result: { _id: ObjectId; oldReviews: number }[] =
      await Review.aggregate()
        .match({
          date: { $lt: from },
          topicId: { $exists: true },
        })
        .group({ _id: "$topicId", oldReviews: { $sum: 1 } })
        .exec();
    return result.reduce(
      (oldByTopic, topic) =>
        oldByTopic.set(topic._id.toString(), topic.oldReviews),
      new Map<string, number>()
    );
  };

  const getAverageRatings = async (
    from: Date,
    to: Date
  ): Promise<Map<string, number>> => {
    const result: { _id: ObjectId; averageRating: number }[] =
      await Review.aggregate()
        .match({ date: { $gte: from, $lte: to }, topicId: { $exists: true } })
        .group({ _id: "$topicId", averageRating: { $avg: "$rating" } })
        .exec();
    return result.reduce(
      (ratingByTopic, topic) =>
        ratingByTopic.set(topic._id.toString(), topic.averageRating),
      new Map<string, number>()
    );
  };

  const [newByTopic, oldByTopic, averageByTopic] = await Promise.all([
    getNewReviews(from, to),
    getOldReviews(from),
    getAverageRatings(from, to),
  ]);

  const summaryByTopic = new Map<string, TopicSummary>();

  const ids = new Set([
    ...Array.from(newByTopic.keys()),
    ...Array.from(oldByTopic.keys()),
    ...Array.from(averageByTopic.keys()),
  ]);

  ids.forEach((id) =>
    summaryByTopic.set(id, {
      newReviews: newByTopic.get(id) || 0,
      oldReviews: oldByTopic.get(id) || 0,
      averageRating: averageByTopic.get(id) || 0,
    })
  );

  return summaryByTopic;
};
