import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config";
import routes from "./routes";

const app = express();

// Use Helmet middleware for security
app.use(helmet());

// Enable CORS
app.use(cors({ origin: config.get("origin") }));

// Parse request bodies as JSON
app.use(express.json());

// Use routes
app.use("/api", routes);

// Set default error handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).send("Server error");
  next();
});

export default app;
