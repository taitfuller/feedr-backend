import { User, IUser } from "../models";

export const findAndUpdateOrCreateUser = async (
  githubId: number,
  doc: Omit<IUser, "_id" | "githubId">
): Promise<IUser> => {
  const user = await User.findOneAndUpdate({ githubId: githubId }, doc, {
    lean: true,
    new: true,
  });

  return user ?? (await User.create({ githubId, ...doc })).toObject();
};
