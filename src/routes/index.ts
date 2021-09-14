import { Router } from "express";
import helloWorld from "./helloWorld";

const routes = Router();

routes.use("/hello-world", helloWorld);

export default routes;
