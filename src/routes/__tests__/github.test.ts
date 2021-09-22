import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createIssue } from "../../services/github";
import { getAccessToken } from "../../services/user";

jest.mock("../../services/user");
const mockedGetAccessToken = getAccessToken as jest.MockedFunction<
  typeof getAccessToken
>;
jest.mock("../../services/github");
const mockedCreateIssue = createIssue as jest.MockedFunction<
  typeof createIssue
>;

const token = jwt.sign({ sub: "1234" }, config.get("jwt_secret"));

describe("routes/github.ts", () => {
  describe("POST /api/github/issue", () => {
    it("Creates issue with status 201", async () => {
      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(201, "Created");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(1);
      expect(mockedGetAccessToken).toHaveBeenCalledWith("1234");
      expect(mockedCreateIssue).toHaveBeenCalledTimes(1);
      expect(mockedCreateIssue).toHaveBeenCalledWith(
        "abc123",
        "testuser",
        "testrepo",
        "Testing Testing 123",
        "# THIS IS A TEST"
      );
    });

    it("Returns status 400 if owner is not provided", async () => {
      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(400, "`owner` is required");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(0);
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if repo is not provided", async () => {
      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(400, "`repo` is required");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(0);
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if title is not provided", async () => {
      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          body: "# THIS IS A TEST",
        })
        .expect(400, "`title` is required");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(0);
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if body is not provided", async () => {
      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
        })
        .expect(400, "`body` is required");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(0);
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 401 if access token is null", async () => {
      mockedGetAccessToken.mockResolvedValueOnce(null);

      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(401, "Unauthorized");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(1);
      expect(mockedGetAccessToken).toHaveBeenCalledWith("1234");
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 401 if no token provided", async () => {
      await request(app)
        .post("/api/github/issue")
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(401, "No authorization token was found");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(0);
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 401 if invalid token provided", async () => {
      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer let.me.in`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(401, "invalid token");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(0);
      expect(mockedCreateIssue).toHaveBeenCalledTimes(0);
    });

    it("Returns status 404 if service returns 403", async () => {
      mockedCreateIssue.mockResolvedValueOnce(403);

      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(403, "Forbidden");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(1);
      expect(mockedGetAccessToken).toHaveBeenCalledWith("1234");
      expect(mockedCreateIssue).toHaveBeenCalledTimes(1);
      expect(mockedCreateIssue).toHaveBeenCalledWith(
        "abc123",
        "testuser",
        "testrepo",
        "Testing Testing 123",
        "# THIS IS A TEST"
      );
    });

    it("Returns status 404 if service returns 404", async () => {
      mockedCreateIssue.mockResolvedValueOnce(404);

      await request(app)
        .post("/api/github/issue")
        .set("Authorization", `Bearer ${token}`)
        .send({
          owner: "testuser",
          repo: "testrepo",
          title: "Testing Testing 123",
          body: "# THIS IS A TEST",
        })
        .expect(404, "Not Found");

      expect(mockedGetAccessToken).toHaveBeenCalledTimes(1);
      expect(mockedGetAccessToken).toHaveBeenCalledWith("1234");
      expect(mockedCreateIssue).toHaveBeenCalledTimes(1);
      expect(mockedCreateIssue).toHaveBeenCalledWith(
        "abc123",
        "testuser",
        "testrepo",
        "Testing Testing 123",
        "# THIS IS A TEST"
      );
    });
  });
});
