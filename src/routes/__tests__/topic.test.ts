import request from "supertest";
import app from "../../app";
import { getSummaryByTopic, getTopic, getTopics } from "../../services/topic";
import jwt from "jsonwebtoken";
import config from "../../config";

jest.mock("../../services/topic");

const mockedGetTopics = getTopics as jest.MockedFunction<typeof getTopics>;
const mockedGetTopic = getTopic as jest.MockedFunction<typeof getTopic>;
const mockedGetSummaryByTopic = getSummaryByTopic as jest.MockedFunction<
  typeof getSummaryByTopic
>;

const token = jwt.sign(
  { sub: "61495e3fb656d914455a2a38" },
  config.get("jwt_secret")
);

describe("routes/topic.ts", () => {
  describe("GET /api/topic", () => {
    it("Returns status 200 and topics", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(200, [
          {
            _id: "613c4a58b9e08b7a26724f3b",
            keywords: ["cool", "birthday"],
            summary: "A really cool day to have a birthday",
            type: "featureRequest",
            counts: {
              newReviews: 1,
              oldReviews: 1,
              averageRating: 5,
            },
            reviews: [
              {
                _id: "613c4a59b9e08b7a26724f57",
                date: new Date(2021, 8, 13).toJSON(),
                platform: "iOS",
                type: "featureRequest",
                rating: 5,
                text: "A really cool day to have a birthday",
                flag: false,
                topicId: "613c4a58b9e08b7a26724f3b",
              },
              {
                _id: "613c4a59b9e08b7a26724f59",
                date: new Date(2021, 8, 1).toJSON(),
                platform: "iOS",
                type: "bugReport",
                rating: 4,
                text: "A terrible day to have a birthday",
                flag: false,
                topicId: "613c4a58b9e08b7a26724f3b",
              },
            ],
          },
          {
            _id: "613c4a58b9e08b7a26724f3c",
            keywords: ["awesome", "birthday"],
            summary: "An awesome day to have a birthday",
            type: "featureRequest",
            counts: {
              newReviews: 1,
              oldReviews: 0,
              averageRating: 3,
            },
            reviews: [
              {
                _id: "613c4a59b9e08b7a26724f58",
                date: new Date(2021, 8, 16).toJSON(),
                platform: "Android",
                type: "featureRequest",
                rating: 3,
                text: "An awesome day to have a birthday",
                flag: true,
                topicId: "613c4a58b9e08b7a26724f3c",
              },
            ],
          },
        ]);

      expect(mockedGetTopics).toHaveBeenCalledTimes(1);
      expect(mockedGetTopics).toHaveBeenCalledWith(
        "614d3961fc9e3d5748ddd428",
        new Date("2021-08-01"),
        new Date("2021-08-29"),
        ["iOS", "Android"]
      );
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(1);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledWith(
        "614d3961fc9e3d5748ddd428",
        new Date("2021-08-01"),
        new Date("2021-08-29"),
        ["iOS", "Android"]
      );
    });

    it("Returns status 200 and topics with empty counts", async () => {
      mockedGetSummaryByTopic.mockResolvedValueOnce(new Map());

      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(200, [
          {
            _id: "613c4a58b9e08b7a26724f3b",
            keywords: ["cool", "birthday"],
            summary: "A really cool day to have a birthday",
            type: "featureRequest",
            counts: {
              newReviews: 0,
              oldReviews: 0,
              averageRating: 0,
            },
            reviews: [
              {
                _id: "613c4a59b9e08b7a26724f57",
                date: new Date(2021, 8, 13).toJSON(),
                platform: "iOS",
                type: "featureRequest",
                rating: 5,
                text: "A really cool day to have a birthday",
                flag: false,
                topicId: "613c4a58b9e08b7a26724f3b",
              },
              {
                _id: "613c4a59b9e08b7a26724f59",
                date: new Date(2021, 8, 1).toJSON(),
                platform: "iOS",
                type: "bugReport",
                rating: 4,
                text: "A terrible day to have a birthday",
                flag: false,
                topicId: "613c4a58b9e08b7a26724f3b",
              },
            ],
          },
          {
            _id: "613c4a58b9e08b7a26724f3c",
            keywords: ["awesome", "birthday"],
            summary: "An awesome day to have a birthday",
            type: "featureRequest",
            counts: {
              newReviews: 0,
              oldReviews: 0,
              averageRating: 0,
            },
            reviews: [
              {
                _id: "613c4a59b9e08b7a26724f58",
                date: new Date(2021, 8, 16).toJSON(),
                platform: "Android",
                type: "featureRequest",
                rating: 3,
                text: "An awesome day to have a birthday",
                flag: true,
                topicId: "613c4a58b9e08b7a26724f3c",
              },
            ],
          },
        ]);

      expect(mockedGetTopics).toHaveBeenCalledTimes(1);
      expect(mockedGetTopics).toHaveBeenCalledWith(
        "614d3961fc9e3d5748ddd428",
        new Date("2021-08-01"),
        new Date("2021-08-29"),
        ["iOS", "Android"]
      );
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(1);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledWith(
        "614d3961fc9e3d5748ddd428",
        new Date("2021-08-01"),
        new Date("2021-08-29"),
        ["iOS", "Android"]
      );
    });

    it("Returns status 400 if feed has invalid format", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=iOS&platform=Android&feed=feed.me"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid ID format for `feed`");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if from has invalid format", async () => {
      await request(app)
        .get(
          "/api/topic?from=invalid-date&to=2021-08-29&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid date format");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if to has invalid format", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=invalid_date&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid date format");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if from and to has invalid format", async () => {
      await request(app)
        .get(
          "/api/topic?from=invalid_date&to=invalid_date&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid date format");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if feed is not provided", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=iOS&platform=Android"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`feed` is required");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if from is not provided", async () => {
      await request(app)
        .get(
          "/api/topic?to=2021-08-29&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`from` and `to` are required");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if to is not provided", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`from` and `to` are required");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if from and to are not provided", async () => {
      await request(app)
        .get(
          "/api/topic?platform=iOS&platform=Android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`from` and `to` are required");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if platform is not provided", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`platform` is required");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if platform is provided single invalid value", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=ios&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`platform` is invalid");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if platform is provided multiple invalid values", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=ios&platform=android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "`platform` is invalid");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if no token provided", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=ios&platform=android&feed=614d3961fc9e3d5748ddd428"
        )
        .expect(401, "No authorization token was found");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if invalid token provided", async () => {
      await request(app)
        .get(
          "/api/topic?from=2021-08-01&to=2021-08-29&platform=ios&platform=android&feed=614d3961fc9e3d5748ddd428"
        )
        .set("Authorization", `Bearer let.me.in`)
        .expect(401, "invalid token");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });
  });

  describe("GET /api/topic/:id", () => {
    it("Returns status 200 and topic", async () => {
      await request(app)
        .get("/api/topic/613c4a58b9e08b7a26724f3b")
        .set("Authorization", `Bearer ${token}`)
        .expect(200, {
          _id: "613c4a58b9e08b7a26724f3b",
          keywords: ["cool", "birthday"],
          summary: "A really cool day to have a birthday",
          type: "featureRequest",
          reviews: [
            {
              _id: "613c4a59b9e08b7a26724f57",
              date: new Date(2021, 8, 13).toJSON(),
              platform: "iOS",
              type: "featureRequest",
              rating: 5,
              text: "A really cool day to have a birthday",
              flag: false,
              topicId: "613c4a58b9e08b7a26724f3b",
            },
            {
              _id: "613c4a59b9e08b7a26724f59",
              date: new Date(2021, 8, 17).toJSON(),
              platform: "iOS",
              type: "bugReport",
              rating: 4,
              text: "A terrible day to have a birthday",
              flag: false,
              topicId: "613c4a58b9e08b7a26724f3b",
            },
          ],
        });

      expect(mockedGetTopic).toHaveBeenCalledTimes(1);
      expect(mockedGetTopic).toHaveBeenCalledWith("613c4a58b9e08b7a26724f3b");
    });

    it("Returns status 400 if invalid id provided", async () => {
      await request(app)
        .get("/api/topic/invalid-id")
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid ID format");

      expect(mockedGetTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 401 if no token provided", async () => {
      await request(app)
        .get("/api/topic/613c4a58b9e08b7a26724f3b")
        .expect(401, "No authorization token was found");

      expect(mockedGetTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 401 if invalid token provided", async () => {
      await request(app)
        .get("/api/topic/613c4a58b9e08b7a26724f3b")
        .set("Authorization", `Bearer let.me.in`)
        .expect(401, "invalid token");

      expect(mockedGetTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 404 if topic not found", async () => {
      mockedGetTopic.mockResolvedValueOnce(null);

      await request(app)
        .get("/api/topic/613c4a58b9e08b7a26724f3b")
        .set("Authorization", `Bearer ${token}`)
        .expect(404, "Topic not found");

      expect(mockedGetTopic).toHaveBeenCalledTimes(1);
      expect(mockedGetTopic).toHaveBeenCalledWith("613c4a58b9e08b7a26724f3b");
    });
  });
});
