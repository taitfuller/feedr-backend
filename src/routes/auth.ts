import { Router } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import config from "../config";
import { findAndUpdateOrCreateUser } from "../services/user";

const router = Router();

passport.use(
  new GitHubStrategy(
    {
      clientID: config.get("github_client_id"),
      clientSecret: config.get("github_client_secret"),
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        cb(
          null,
          await findAndUpdateOrCreateUser(+profile.id, {
            displayName: profile.username ?? "",
          })
        );
      } catch (err) {
        cb(err);
      }
    }
  )
);

router.get("/github", passport.authenticate("github", { session: false }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
