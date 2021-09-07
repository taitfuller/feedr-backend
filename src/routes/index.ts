import { Router } from "express";
import example from "./example";
import helloWorld from "./helloWorld";

const routes = Router();

routes.use("/example", example);
routes.use("/hello-world", helloWorld);

export default routes;
