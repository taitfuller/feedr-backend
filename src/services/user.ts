import { User, IUser } from "../models";

export const findAndUpdateOrCreateUser = async (
  githubId: number,
  doc: Omit<IUser, "_id" | "githubId">
): Promise<IUser> => {
  const user = await User.findOneAndUpdate({ githubId: githubId }, doc, {
    new: true,
  })
    .lean()
    .exec();

  return user ?? (await User.create({ githubId, ...doc })).toObject();
};

export const getUser = async (id: string): Promise<IUser | null> => {
  return User.findById(id).lean().exec();
};
