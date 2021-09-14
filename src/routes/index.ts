import { Router } from "express";
import review from "./review";

const routes = Router();

routes.use("/review", review);

export default routes;
