import { Router } from "express";
import { setFlag } from "../services/review";
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
    res.status(400).send("Validation Error");
    return;
  }

  if (review) {
    res.status(200).json(review);
  } else {
    res.status(404).send("Review not found");
  }
});

export default router;
