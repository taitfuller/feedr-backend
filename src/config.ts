import convict from "convict";
import dotenv from "dotenv";

dotenv.config();

const config = convict({
  port: {
    format: "port",
    default: 3001,
    env: "PORT",
  },
  origin: {
    format: "url",
    default: "http://localhost:3000",
    env: "ORIGIN",
  },
  mongo_uri: {
    format: "String",
    default: "mongodb://localhost:27017/st-marks-graveyard",
    env: "MONGO_URI",
  },
});

config.validate({ allowed: "strict" });

export default config;
