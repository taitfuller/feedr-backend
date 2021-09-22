import { NextFunction, Request, Response, Router } from "express";
import jwt, { UnauthorizedError } from "express-jwt";
import auth from "./auth";
import github from "./github";
import review from "./review";
import topic from "./topic";
import config from "../config";
import user from "./user";

const routes = Router();

routes.use("/auth", auth);

routes.use(jwt({ secret: config.get("jwt_secret"), algorithms: ["HS256"] }));
routes.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof UnauthorizedError)
    return res.status(err.status).send(err.message);
  next();
});

routes.use("/github", github);
routes.use("/review", review);
routes.use("/topic", topic);
routes.use("/user", user);

export default routes;
