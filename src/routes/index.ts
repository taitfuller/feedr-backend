import { Router } from "express";
import helloWorld from "./helloWorld";
import review from "./review";

const routes = Router();

routes.use("/hello-world", helloWorld);
routes.use("/review", review);

export default routes;
