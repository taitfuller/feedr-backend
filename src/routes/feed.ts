import { Router } from "express";
import { createFeed, getApps } from "../services/feed";

const router = Router();

router.get("/", async (req, res) => {
  const apps = await getApps();

  res.status(200).json(apps);
});

router.post("/", async (req, res) => {
  const { appName, repoName } = req.body;

  const feedId = await createFeed(appName, repoName, req.user.sub);

  if (feedId) {
    res.status(201).send(feedId);
  } else {
    res.status(404).send("Feed not fonud");
  }
});

export default router;
