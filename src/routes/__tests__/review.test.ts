import request from "supertest";
import app from "../../app";
import { removeTopic, setFlag } from "../../services/review";

jest.mock("../../services/review");
const mockedSetFlag = setFlag as jest.MockedFunction<typeof setFlag>;
const mockedRemoveTopic = removeTopic as jest.MockedFunction<
  typeof removeTopic
>;

describe("routes/review.ts", () => {
  describe("PATCH /api/review/:id/flag", () => {
    it("Returns status 200 and sets flag to true", async () => {
      await request(app)
        .patch("/api/review/613c4a59b9e08b7a26724f57/flag")
        .expect(200, {
          _id: "613c4a59b9e08b7a26724f57",
          date: "2021-09-12T12:00:00.000Z",
          platform: "iOS",
          category: "INQUIRY",
          rating: 5,
          text: "A really cool day to have a birthday",
          flag: true,
          topicId: "613c4a58b9e08b7a26724f3b",
        });

      expect(mockedSetFlag).toHaveBeenCalledTimes(1);
      expect(mockedSetFlag).toHaveBeenCalledWith(
        "613c4a59b9e08b7a26724f57",
        undefined
      );
    });

    it("Returns status 400 if invalid id provided", async () => {
      await request(app)
        .patch("/api/review/invalid-id/flag")
        .expect(400, "Invalid ID format");

      expect(mockedSetFlag).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if schema validation fails", async () => {
      mockedSetFlag.mockRejectedValueOnce({});

      await request(app)
        .patch("/api/review/613c4a59b9e08b7a26724f57/flag")
        .expect(400, "Validation error");

      expect(mockedSetFlag).toHaveBeenCalledTimes(1);
      expect(mockedSetFlag).toHaveBeenCalledWith(
        "613c4a59b9e08b7a26724f57",
        undefined
      );
    });

    it("Returns status 404 if review not found", async () => {
      mockedSetFlag.mockResolvedValueOnce(null);

      await request(app)
        .patch("/api/review/613c4a59b9e08b7a26724f57/flag")
        .expect(404, "Review not found");

      expect(mockedSetFlag).toHaveBeenCalledTimes(1);
      expect(mockedSetFlag).toHaveBeenCalledWith(
        "613c4a59b9e08b7a26724f57",
        undefined
      );
    });
  });

  describe("PATCH /api/review/:id/remove-topic", () => {
    it("Returns status 200 and removes topic", async () => {
      await request(app)
        .patch("/api/review/613c4a59b9e08b7a26724f57/remove-topic")
        .expect(200, {
          _id: "613c4a59b9e08b7a26724f57",
          date: "2021-09-12T12:00:00.000Z",
          platform: "iOS",
          category: "INQUIRY",
          rating: 5,
          text: "A really cool day to have a birthday",
          flag: false,
        });

      expect(mockedRemoveTopic).toHaveBeenCalledTimes(1);
      expect(mockedRemoveTopic).toHaveBeenCalledWith(
        "613c4a59b9e08b7a26724f57"
      );
    });

    it("Returns status 400 if invalid id provided", async () => {
      await request(app)
        .patch("/api/review/invalid-id/remove-topic")
        .expect(400, "Invalid ID format");

      expect(mockedRemoveTopic).toHaveBeenCalledTimes(0);
    });

    it("Returns status 400 if schema validation fails", async () => {
      mockedRemoveTopic.mockRejectedValueOnce({ _message: "Unknown error" });

      await request(app)
        .patch("/api/review/613c4a59b9e08b7a26724f57/remove-topic")
        .expect(500, "Server error");

      expect(mockedRemoveTopic).toHaveBeenCalledTimes(1);
      expect(mockedRemoveTopic).toHaveBeenCalledWith(
        "613c4a59b9e08b7a26724f57"
      );
    });

    it("Returns status 404 if review not found", async () => {
      mockedRemoveTopic.mockResolvedValueOnce(null);

      await request(app)
        .patch("/api/review/613c4a59b9e08b7a26724f57/remove-topic")
        .expect(404, "Review not found");

      expect(mockedRemoveTopic).toHaveBeenCalledTimes(1);
      expect(mockedRemoveTopic).toHaveBeenCalledWith(
        "613c4a59b9e08b7a26724f57"
      );
    });
  });
});
