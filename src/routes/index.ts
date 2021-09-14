import { Router } from "express";
import review from "./review";
import topic from "./topic";

const routes = Router();

routes.use("/review", review);
routes.use("/topic", topic);

export default routes;
