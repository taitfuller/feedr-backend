import { IReview, Review } from "../models";

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
  const getNewReviewsCounts = async (
    from: Date,
    to: Date
  ): Promise<{
    featureRequests: number;
    bugReports: number;
    other: number;
  }> => {
    const result = await Review.aggregate()
      .match({ date: { $gte: from, $lte: to } })
      .group({
        _id: "$category",
        count: { $sum: 1 },
      })
      .exec();

    const counts = {
      featureRequests: 0,
      bugReports: 0,
      other: 0,
    };
    result.forEach((category: { _id: string; count: number }) => {
      switch (category._id) {
        case "bugReport":
          counts.bugReports = category.count;
          break;
        case "featureRequest":
          counts.featureRequests = category.count;
          break;
        case "other":
          counts.other = category.count;
          break;
      }
    });
    return counts;
  };

  const getOldReviewsCount = async (from: Date): Promise<number> => {
    const result = await Review.aggregate()
      .match({ date: { $lt: from } })
      .count("oldReviews")
      .exec();
    return result.length ? result[0]["oldReviews"] : 0;
  };

  const getTopicsCount = async (from: Date, to: Date): Promise<number> => {
    const result = await Review.aggregate()
      .match({
        date: { $gte: from, $lte: to },
        topicId: { $exists: true },
      })
      .group({ _id: "$topicId" })
      .count("topics")
      .exec();
    return result.length ? result[0]["topics"] : 0;
  };

  const getAverageRating = async (from: Date, to: Date): Promise<number> => {
    const result = await Review.aggregate()
      .match({ date: { $gte: from, $lte: to } })
      .group({ _id: null, averageRating: { $avg: "$rating" } })
      .exec();
    return result.length ? result[0]["averageRating"] : 0;
  };

  const [newReviewsCounts, oldReviews, topics, averageRating] =
    await Promise.all([
      getNewReviewsCounts(from, to),
      getOldReviewsCount(from),
      getTopicsCount(from, to),
      getAverageRating(from, to),
    ]);

  return {
    ...newReviewsCounts,
    oldReviews,
    topics,
    averageRating,
  };
};
