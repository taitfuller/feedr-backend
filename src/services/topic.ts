import { ITopic, Review, Topic } from "../models";

export const getTopics = async (from: Date, to: Date): Promise<ITopic[]> => {
  const topicIds = await Review.distinct("topicId", {
    date: { $gte: from, $lte: to },
  }).exec();

  return Topic.find({ _id: { $in: topicIds } })
    .lean()
    .exec();
};

export const getTopic = async (id: string): Promise<ITopic | null> => {
  return Topic.findById(id).lean().exec();
};
