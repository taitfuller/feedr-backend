import { IReview, Review } from "../models";
import { ObjectId } from "mongodb";

export const setFlag = async (
  id: string,
  flag = true
): Promise<IReview | null> => {
  return Review.findByIdAndUpdate(
    id,
    { flag },
    { new: true, runValidators: true }
  ).lean();
};

export const removeTopic = async (id: string): Promise<IReview | null> => {
  return Review.findByIdAndUpdate(
    id,
    { $unset: { topicId: 1 } },
    { new: true, runValidators: true }
  );
};

export const getReviewSummary = async (
  feed: string,
  from: Date,
  to: Date
): Promise<{
  featureRequests: number;
  bugReports: number;
  other: number;
  oldReviews: number;
  topics: number;
  averageRating: number;
}> => {
  const feedId = new ObjectId(feed);

  const getNewReviewsCounts = async (
    feedId: ObjectId,
    from: Date,
    to: Date
  ): Promise<{
    featureRequests: number;
    bugReports: number;
    other: number;
  }> => {
    const result = await Review.aggregate()
      .match({ feed: feedId, date: { $gte: from, $lte: to } })
      .group({
        _id: "$type",
        count: { $sum: 1 },
      })
      .exec();

    const counts = {
      featureRequests: 0,
      bugReports: 0,
      other: 0,
    };
    result.forEach((type: { _id: string; count: number }) => {
      switch (type._id) {
        case "bugReport":
          counts.bugReports = type.count;
          break;
        case "featureRequest":
          counts.featureRequests = type.count;
          break;
        case "other":
          counts.other = type.count;
          break;
      }
    });
    return counts;
  };

  const getOldReviewsCount = async (
    feedId: ObjectId,
    from: Date
  ): Promise<number> => {
    const result = await Review.aggregate()
      .match({ feed: feedId, date: { $lt: from } })
      .count("oldReviews")
      .exec();
    return result.length ? result[0]["oldReviews"] : 0;
  };

  const getTopicsCount = async (
    feedId: ObjectId,
    from: Date,
    to: Date
  ): Promise<number> => {
    const result = await Review.aggregate()
      .match({
        feed: feedId,
        date: { $gte: from, $lte: to },
        topicId: { $exists: true },
      })
      .group({ _id: "$topicId" })
      .count("topics")
      .exec();
    return result.length ? result[0]["topics"] : 0;
  };

  const getAverageRating = async (
    feedId: ObjectId,
    from: Date,
    to: Date
  ): Promise<number> => {
    const result = await Review.aggregate()
      .match({ feed: feedId, date: { $gte: from, $lte: to } })
      .group({ _id: null, averageRating: { $avg: "$rating" } })
      .exec();
    return result.length ? result[0]["averageRating"] : 0;
  };

  const [newReviewsCounts, oldReviews, topics, averageRating] =
    await Promise.all([
      getNewReviewsCounts(feedId, from, to),
      getOldReviewsCount(feedId, from),
      getTopicsCount(feedId, from, to),
      getAverageRating(feedId, from, to),
    ]);

  return {
    ...newReviewsCounts,
    oldReviews,
    topics,
    averageRating,
  };
};
