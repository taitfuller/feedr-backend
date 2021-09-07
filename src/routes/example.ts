import { Router } from "express";
import { addExample, getExamples } from "../services/example";

const router = Router();

router.get("/", async (_req, res) => {
  const examples = await getExamples();

  res.status(200).json(examples);
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (name === undefined) {
    res.status(400).send("No `name` set");
    return;
  } else if (typeof name !== "string") {
    res.status(400).send("`name` is not type `string`");
    return;
  }

  const example = await addExample(name);

  res.status(201).json(example);
});

export default router;
