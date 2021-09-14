import { Router } from "express";
import { removeTopic, setFlag } from "../services/review";
import { isValidObjectId } from "mongoose";

const router = Router();

router.use("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    next();
  } else {
    res.status(400).send("Invalid ID format");
  }
});

router.patch("/:id/flag", async (req, res) => {
  const { id } = req.params;
  const { flag } = req.body;

  let review;

  try {
    review = await setFlag(id, flag);
  } catch (error) {
    res.status(400).send("Validation error");
    return;
  }

  if (review) {
    res.status(200).json(review);
  } else {
    res.status(404).send("Review not found");
  }
});

router.patch("/:id/remove-topic", async (req, res, next) => {
  const { id } = req.params;

  let review;

  try {
    review = await removeTopic(id);
  } catch (error) {
    next(error);
    return;
  }

  if (review) {
    res.status(200).json(review);
  } else {
    res.status(404).send("Review not found");
  }
});

export default router;
