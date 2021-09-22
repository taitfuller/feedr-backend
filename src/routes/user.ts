import { Router } from "express";
import { getUser } from "../services/user";

const router = Router();

router.get("/", async (req, res) => {
  const user = await getUser(req.user.sub);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("User not found");
  }
});

export default router;
