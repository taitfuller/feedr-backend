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
