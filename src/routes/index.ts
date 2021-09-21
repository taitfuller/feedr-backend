import { Router } from "express";
import auth from "./auth";
import review from "./review";
import topic from "./topic";

const routes = Router();

routes.use("/auth", auth);
routes.use("/review", review);
routes.use("/topic", topic);

export default routes;
