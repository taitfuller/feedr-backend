import request from "supertest";
import app from "../../app";

describe("routes/helloWorld.ts", () => {
  describe("GET /api/hello-world", () => {
    it("Responds with 200 and greeting if name is supplied", async () => {
      await request(app)
        .get("/api/hello-world")
        .query({ name: "Bob" })
        .expect(200, "Hello Bob!");
    });

    it("Responds with 400 and error if name is not supplied", async () => {
      await request(app).get("/api/hello-world").expect(400, "No `name` set");
    });
  });
});
