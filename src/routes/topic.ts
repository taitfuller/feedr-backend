import { Router } from "express";
import { getSummaryByTopic, getTopic, getTopics } from "../services/topic";
import { isValidObjectId } from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  const { from, to } = req.query as { from: string; to: string };

  if (!from || !to) {
    res.status(400).send("`from` and `to` must be provided");
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

  const topics = await getTopics(fromDate, toDate);

  const summaryByTopic = await getSummaryByTopic(fromDate, toDate);

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
