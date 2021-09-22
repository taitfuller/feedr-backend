import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";
import config from "../../config";
import { getUser } from "../../services/user";

jest.mock("../../services/user");
const mockedGetUser = getUser as jest.MockedFunction<typeof getUser>;

const token = jwt.sign({ sub: "1234" }, config.get("jwt_secret"));

describe("routes/user.ts", () => {
  describe("GET /api/user", () => {
    it("Returns user with status 200", async () => {
      await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, {
          _id: "61495e3fb656d914455a2a38",
          githubId: 1234,
          displayName: "testuser",
        });

      expect(mockedGetUser).toHaveBeenCalledTimes(1);
      expect(mockedGetUser).toHaveBeenCalledWith("1234");
    });

    it("Returns status 401 if no token provided", async () => {
      await request(app)
        .get("/api/user")
        .expect(401, "No authorization token was found");

      expect(mockedGetUser).toHaveBeenCalledTimes(0);
    });

    it("Returns status 401 if invalid token provided", async () => {
      await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer let.me.in`)
        .expect(401, "invalid token");

      expect(mockedGetUser).toHaveBeenCalledTimes(0);
    });

    it("Returns status 404 if user not found", async () => {
      mockedGetUser.mockResolvedValueOnce(null);

      await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${token}`)
        .expect(404, "User not found");

      expect(mockedGetUser).toHaveBeenCalledTimes(1);
      expect(mockedGetUser).toHaveBeenCalledWith("1234");
    });
  });
});
