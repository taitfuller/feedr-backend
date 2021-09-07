import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const { name } = req.query;

  if (name === undefined) {
    res.status(400).send("No `name` set");
    return;
  }

  res.status(200);
  res.send(`Hello ${name}!`);
});

export default router;
