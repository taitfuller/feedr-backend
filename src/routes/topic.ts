import { Router } from "express";
import { getSummaryByTopic, getTopic, getTopics } from "../services/topic";
import { isValidObjectId } from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  const { from, to, platform } = req.query as {
    from: string;
    to: string;
    platform: string | string[];
  };

  if (!from || !to) {
    res.status(400).send("`from` and `to` are required");
    return;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (
    fromDate.toString() === "Invalid Date" ||
    toDate.toString() === "Invalid Date"
  ) {
    res.status(400).send("Invalid date format");
    return;
  }

  if (!platform) {
    res.status(400).send("`platform` is required");
    return;
  }
  const platformArray = Array.isArray(platform) ? platform : [platform];
  const validPlatforms = new Set(["iOS", "Android"]);
  if (platformArray.some((platform) => !validPlatforms.has(platform))) {
    res.status(400).send("`platform` is invalid");
    return;
  }

  const topics = await getTopics(
    fromDate,
    toDate,
    platformArray as ("iOS" | "Android")[]
  );

  const summaryByTopic = await getSummaryByTopic(
    fromDate,
    toDate,
    platformArray
  );

  res.status(200).json(
    topics.map((topic) => ({
      ...topic,
      counts: summaryByTopic.get(topic._id.toString()) ?? {
        newReviews: 0,
        oldReviews: undefined,
        averageRating: undefined,
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
