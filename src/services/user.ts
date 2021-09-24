import { User, IUser } from "../models";

export const findAndUpdateOrCreateUser = async (
  githubId: number,
  doc: Omit<IUser, "_id" | "githubId">
): Promise<Omit<IUser, "githubAccessToken feeds">> => {
  const user =
    (await User.findOneAndUpdate({ githubId: githubId }, doc, {
      new: true,
    }).exec()) ?? (await User.create({ githubId, ...doc }));

  return {
    _id: user._id,
    githubId: user.githubId,
    displayName: user.displayName,
  };
};

export const getUser = async (id: string): Promise<IUser | null> => {
  return User.findById(id, "-githubAccessToken")
    .populate("feeds")
    .lean()
    .exec();
};

export const getAccessToken = async (id: string): Promise<string | null> => {
  const user = await User.findById(id);

  if (user) return user.githubAccessToken;
  return null;
};
