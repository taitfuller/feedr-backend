import mongoose from "mongoose";
import { Db } from "mongodb";
import { addExample, getExamples } from "../example";

let db: Db;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__ + global.__MONGO_DB_NAME__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = mongoose.connection.db;
});

afterEach(async () => {
  await db.dropCollection("examples");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("services/example.ts", () => {
  describe("addExample()", () => {
    it("Adds new Example in the database", async () => {
      await addExample("Bob");

      const examples = await db.collection("examples").find().toArray();

      expect(examples).toHaveLength(1);
      expect(examples[0].name).toBe("Bob");
    });
  });

  describe("getExamples()", () => {
    it("Gets all Examples in the database", async () => {
      const examplesColl = db.collection("examples");
      await examplesColl.insertMany([
        { name: "Bob" },
        { name: "Fred" },
        { name: "Jim" },
      ]);

      const examples = await getExamples();

      expect(examples).toHaveLength(3);
      expect(examples[0].name).toBe("Bob");
      expect(examples[1].name).toBe("Fred");
      expect(examples[2].name).toBe("Jim");
    });
  });
});
