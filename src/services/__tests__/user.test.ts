import { Collection, Db, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { findAndUpdateOrCreateUser, getUser } from "../user";
import { IUser } from "../../models";

let db: Db;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__ + global.__MONGO_DB_NAME__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: false,
  });
  db = mongoose.connection.db;
});

let userColl: Collection<IUser>;

beforeEach(async () => {
  userColl = await db.createCollection("users");
});

afterEach(async () => {
  await userColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const mockUsers = [
  {
    _id: new ObjectId("61495e3fb656d914455a2a38"),
    githubId: 123,
    displayName: "testuser",
  },
] as IUser[];

describe("services/user.ts", () => {
  describe("findOrCreateUser()", () => {
    it("Returns an updated existing user", async () => {
      await userColl.insertMany(mockUsers);

      const user = await findAndUpdateOrCreateUser(123, {
        displayName: "usertest",
      });

      expect(user?._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(user?.githubId).toBe(123);
      expect(user?.displayName).toBe("usertest");

      const users = await userColl.find().toArray();
      expect(users).toHaveLength(1);
      expect(users[0]._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(users[0].githubId).toBe(123);
      expect(users[0].displayName).toBe("usertest");
    });

    it("Returns a newly created user", async () => {
      await userColl.insertMany(mockUsers);

      const user = await findAndUpdateOrCreateUser(456, {
        displayName: "usertest",
      });

      expect(user?._id).not.toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(user?.githubId).toBe(456);
      expect(user?.displayName).toBe("usertest");

      const users = await userColl.find().toArray();
      expect(users).toHaveLength(2);
      expect(users[0]._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(users[0].githubId).toBe(123);
      expect(users[0].displayName).toBe("testuser");
      expect(users[1]._id).not.toEqual(
        new ObjectId("613c4a59b9e08b7a26724f57")
      );
      expect(users[1].githubId).toBe(456);
      expect(users[1].displayName).toBe("usertest");
    });
  });

  describe("getUser()", () => {
    it("Returns a user for valid id", async () => {
      await userColl.insertMany(mockUsers);

      const user = await getUser("61495e3fb656d914455a2a38");

      expect(user?._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(user?.githubId).toBe(123);
      expect(user?.displayName).toBe("testuser");
    });

    it("Returns null if user does not exist", async () => {
      await userColl.insertMany(mockUsers);

      const user = await getUser("61495e3fb656d914455a2a39");

      expect(user).toBeNull();
    });
  });
});
