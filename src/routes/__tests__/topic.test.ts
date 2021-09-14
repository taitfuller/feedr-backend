import request from "supertest";
import app from "../../app";
import { getSummaryByTopic, getTopics } from "../../services/topic";

jest.mock("../../services/topic");

const mockedGetTopics = getTopics as jest.MockedFunction<typeof getTopics>;
const mockedGetSummaryByTopic = getSummaryByTopic as jest.MockedFunction<
  typeof getSummaryByTopic
>;

describe("routes/topic.ts", () => {
  describe("GET /api/topic", () => {
    it("Returns status 200 and topics", async () => {
      await request(app)
        .get("/api/topic?from=2021-08-01&to=2021-08-29")
        .expect(200, [
          {
            _id: "613c4a58b9e08b7a26724f3b",
            keywords: ["cool", "birthday"],
            summary: "A really cool day to have a birthday",
            category: "INQUIRY",
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
                category: "INQUIRY",
                rating: 5,
                text: "A really cool day to have a birthday",
                flag: false,
                topicId: "613c4a58b9e08b7a26724f3b",
              },
              {
                _id: "613c4a59b9e08b7a26724f59",
                date: new Date(2021, 8, 1).toJSON(),
                platform: "iOS",
                category: "PROBLEM",
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
            category: "INQUIRY",
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
                category: "INQUIRY",
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
        new Date("2021-08-01"),
        new Date("2021-08-29")
      );
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(1);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledWith(
        new Date("2021-08-01"),
        new Date("2021-08-29")
      );
    });

    it("Returns status 200 and topics with empty counts", async () => {
      mockedGetSummaryByTopic.mockResolvedValueOnce(new Map());

      await request(app)
        .get("/api/topic?from=2021-08-01&to=2021-08-29")
        .expect(200, [
          {
            _id: "613c4a58b9e08b7a26724f3b",
            keywords: ["cool", "birthday"],
            summary: "A really cool day to have a birthday",
            category: "INQUIRY",
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
                category: "INQUIRY",
                rating: 5,
                text: "A really cool day to have a birthday",
                flag: false,
                topicId: "613c4a58b9e08b7a26724f3b",
              },
              {
                _id: "613c4a59b9e08b7a26724f59",
                date: new Date(2021, 8, 1).toJSON(),
                platform: "iOS",
                category: "PROBLEM",
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
            category: "INQUIRY",
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
                category: "INQUIRY",
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
        new Date("2021-08-01"),
        new Date("2021-08-29")
      );
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(1);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledWith(
        new Date("2021-08-01"),
        new Date("2021-08-29")
      );
    });

    it("Returns status 400 if from has invalid format", async () => {
      await request(app)
        .get("/api/topic?from=invalid-date&to=2021-08-29")
        .expect(400, "Invalid date format");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if to has invalid format", async () => {
      await request(app)
        .get("/api/topic?from=2021-08-01&to=invalid_date")
        .expect(400, "Invalid date format");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if from and to has invalid format", async () => {
      await request(app)
        .get("/api/topic?from=invalid_date&to=invalid_date")
        .expect(400, "Invalid date format");

      expect(mockedGetTopics).toHaveBeenCalledTimes(0);
      expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
    });
  });

  it("Returns status 400 if from is not provided", async () => {
    await request(app)
      .get("/api/topic?to=2021-08-29")
      .expect(400, "`from` and `to` must be provided");

    expect(mockedGetTopics).toHaveBeenCalledTimes(0);
    expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
  });

  it("Returns status 400 if to is not provided", async () => {
    await request(app)
      .get("/api/topic?from=2021-08-01")
      .expect(400, "`from` and `to` must be provided");

    expect(mockedGetTopics).toHaveBeenCalledTimes(0);
    expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
  });

  it("Returns status 400 if from and to are not provided", async () => {
    await request(app)
      .get("/api/topic")
      .expect(400, "`from` and `to` must be provided");

    expect(mockedGetTopics).toHaveBeenCalledTimes(0);
    expect(mockedGetSummaryByTopic).toHaveBeenCalledTimes(0);
  });
});
