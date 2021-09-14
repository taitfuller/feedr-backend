import { Router } from "express";
import { getSummaryByTopic, getTopics } from "../services/topic";

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

export default router;
