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
  averageRating: number | undefined;
}> => {
  const newReviews = await Review.aggregate()
    .match({ date: { $gte: from, $lte: to } })
    .group({
      _id: "$category",
      count: { $sum: 1 },
    })
    .exec();

  const newReviewsCounts = {
    featureRequests: 0,
    bugReports: 0,
    other: 0,
  };
  newReviews.forEach((review: { _id: string; count: number }) => {
    switch (review._id) {
      case "PROBLEM":
        newReviewsCounts.bugReports = review.count;
        break;
      case "INQUIRY":
        newReviewsCounts.featureRequests = review.count;
        break;
      case "IRRELEVANT":
        newReviewsCounts.other = review.count;
        break;
    }
  });

  const result = await Review.aggregate()
    .match({ date: { $lt: from } })
    .count("oldReviews")
    .exec();
  const oldReviews = result.length ? result[0]["oldReviews"] : 0;

  const topicsResult = await Review.aggregate()
    .match({
      date: { $gte: from, $lte: to },
      topicId: { $exists: true },
    })
    .group({ _id: "$topicId" })
    .count("topics")
    .exec();
  const topics = topicsResult.length ? topicsResult[0]["topics"] : 0;

  const averageResult = await Review.aggregate()
    .match({ date: { $gte: from, $lte: to } })
    .group({ _id: null, averageRating: { $avg: "$rating" } })
    .exec();
  const averageRating = averageResult.length
    ? averageResult[0]["averageRating"]
    : 0;

  return {
    ...newReviewsCounts,
    oldReviews,
    topics,
    averageRating,
  };
};
