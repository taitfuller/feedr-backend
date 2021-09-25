import { Router } from "express";
import { getSummaryByTopic, getTopic, getTopics } from "../services/topic";
import { isValidObjectId } from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  const { from, to, platform, feed } = req.query as {
    from: string;
    to: string;
    platform: string | string[];
    feed: string;
  };

  if (!feed) return res.status(400).send("`feed` is required");
  if (!isValidObjectId(feed))
    return res.status(400).send("Invalid ID format for `feed`");

  if (!from || !to) return res.status(400).send("`from` and `to` are required");

  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (
    fromDate.toString() === "Invalid Date" ||
    toDate.toString() === "Invalid Date"
  ) {
    return res.status(400).send("Invalid date format");
  }

  if (!platform) {
    return res.status(400).send("`platform` is required");
  }
  const platformArray = Array.isArray(platform) ? platform : [platform];
  const validPlatforms = new Set(["iOS", "Android"]);
  if (platformArray.some((platform) => !validPlatforms.has(platform))) {
    return res.status(400).send("`platform` is invalid");
  }

  const topics = await getTopics(
    feed,
    fromDate,
    toDate,
    platformArray as ("iOS" | "Android")[]
  );

  const summaryByTopic = await getSummaryByTopic(
    feed,
    fromDate,
    toDate,
    platformArray
  );

  res.status(200).json(
    topics.map((topic) => ({
      ...topic,
      counts: summaryByTopic.get(topic._id.toString()) || {
        newReviews: 0,
        oldReviews: 0,
        averageRating: 0,
      },
    }))
  );
});

router.use("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    next();
  } else {
    res.status(400).send("Invalid ID format");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const topic = await getTopic(id);

  if (topic) {
    res.status(200).json(topic);
  } else {
    res.status(404).send("Topic not found");
  }
});

export default router;
