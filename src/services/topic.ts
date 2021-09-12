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

export const getTopicSummary = async (
  id: ObjectId
): Promise<{ reviewCount: number; averageRating: number }> => {
  const getReviewCount = async (id: ObjectId): Promise<number> => {
    const result = await Review.aggregate()
      .match({ topicId: id })
      .count("reviewCount")
      .exec();
    return result.length ? result[0]["reviewCount"] : 0;
  };

  const getAverageRating = async (id: ObjectId): Promise<number> => {
    const result = await Review.aggregate()
      .match({ topicId: id })
      .group({ _id: null, averageRating: { $avg: "$rating" } })
      .exec();
    return result.length ? result[0]["averageRating"] : 0;
  };

  const [reviewCount, averageRating] = await Promise.all([
    getReviewCount(id),
    getAverageRating(id),
  ]);

  return { reviewCount, averageRating };
};
