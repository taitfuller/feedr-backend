import { Router } from "express";
import { getAccessToken } from "../services/user";
import { createIssue, getRepositories } from "../services/github";

const router = Router();

router.get("/repositories", async (req, res) => {
  const token = await getAccessToken(req.user.sub);

  if (!token) return res.status(401).send("Unauthorized");

  const repositories = await getRepositories(token);

  res.json(repositories);
});

router.post("/issue", async (req, res) => {
  const { owner, repo, title, body } = req.body;

  if (!owner) return res.status(400).send("`owner` is required");
  if (!repo) return res.status(400).send("`repo` is required");
  if (!title) return res.status(400).send("`title` is required");
  if (!body) return res.status(400).send("`body` is required");

  const token = await getAccessToken(req.user.sub);

  if (!token) return res.status(401).send("Unauthorized");

  const status = await createIssue(token, owner, repo, title, body);

  res.sendStatus(status);
});

export default router;
