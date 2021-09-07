import request from "supertest";
import app from "../../app";
import { addExample, getExamples } from "../../services/example";

jest.mock("../../services/example");

const mockedAddExample = addExample as jest.Mocked<typeof addExample>;
const mockedGetExamples = getExamples as jest.Mocked<typeof getExamples>;

afterAll(() => {
  jest.clearAllMocks();
});

describe("routes/example.ts", () => {
  describe("GET /api/example", () => {
    it("Responds with status 200 and all examples", async () => {
      await request(app)
        .get("/api/example")
        .expect(200, [{ name: "Bob" }, { name: "Fred" }, { name: "Jim" }]);

      expect(mockedGetExamples).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/example", () => {
    it("Responds with status 201 and created example", async () => {
      await request(app)
        .post("/api/example")
        .send({ name: "Bob" })
        .expect(201)
        .then((res) => {
          if (res.body?.name !== "Bob") throw Error();
        });

      expect(mockedAddExample).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 400 if name not supplied", async () => {
      await request(app).post("/api/example").expect(400, "No `name` set");

      expect(mockedAddExample).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if name not a string", async () => {
      await request(app)
        .post("/api/example")
        .send({ name: 420 })
        .expect(400, "`name` is not type `string`");

      expect(mockedAddExample).toHaveBeenCalledTimes(0);
    });
  });
});
