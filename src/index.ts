import mongoose from "mongoose";
import app from "./app";
import config from "./config";

/* Start Server */
mongoose
  .connect(config.get("mongo_uri"), {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");

    app.listen(config.get("port"), () => {
      console.log(`Listening on port: ${config.get("port")}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
