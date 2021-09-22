import { Collection, Db, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { encrypt, decrypt } from "mongoose-field-encryption";
import { findAndUpdateOrCreateUser, getAccessToken, getUser } from "../user";
import { IUser } from "../../models";
import config from "../../config";
import crypto from "crypto";

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

const secret = crypto
  .createHash("sha256")
  .update(config.get("encryption_secret"))
  .digest("hex")
  .substring(0, 32);

const mockUsers: (IUser & { __enc_githubAccessToken: boolean })[] = [
  {
    _id: new ObjectId("61495e3fb656d914455a2a38"),
    githubId: 123,
    displayName: "testuser",
    githubAccessToken: encrypt(
      "super-top-secret",
      secret,
      () => "JLKJn418bMJiBsw5"
    ),
    __enc_githubAccessToken: true,
  },
];

describe("services/user.ts", () => {
  describe("findOrCreateUser()", () => {
    it("Returns an updated existing user", async () => {
      await userColl.insertMany(mockUsers);

      const user = await findAndUpdateOrCreateUser(123, {
        displayName: "usertest",
        githubAccessToken: "new-super-top-secret",
      });

      expect(user?._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(user?.githubId).toBe(123);
      expect(user?.displayName).toBe("usertest");
      expect((user as IUser).githubAccessToken).toBeUndefined();

      const users = await userColl.find().toArray();
      expect(users).toHaveLength(1);
      expect(users[0]._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(users[0].githubId).toBe(123);
      expect(users[0].displayName).toBe("usertest");
      expect(decrypt(users[0].githubAccessToken, secret)).toBe(
        "new-super-top-secret"
      );
    });

    it("Returns a newly created user", async () => {
      await userColl.insertMany(mockUsers);

      const user = await findAndUpdateOrCreateUser(456, {
        displayName: "usertest",
        githubAccessToken: "new-super-top-secret",
      });

      expect(user?._id).not.toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(user?.githubId).toBe(456);
      expect(user?.displayName).toBe("usertest");
      expect((user as IUser).githubAccessToken).toBeUndefined();

      const users = await userColl.find().toArray();
      expect(users).toHaveLength(2);
      expect(users[0]._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(users[0].githubId).toBe(123);
      expect(users[0].displayName).toBe("testuser");
      expect(decrypt(users[0].githubAccessToken, secret)).toBe(
        "super-top-secret"
      );
      expect(users[1]._id).not.toEqual(
        new ObjectId("613c4a59b9e08b7a26724f57")
      );
      expect(users[1].githubId).toBe(456);
      expect(users[1].displayName).toBe("usertest");
      expect(decrypt(users[1].githubAccessToken, secret)).toBe(
        "new-super-top-secret"
      );
    });
  });

  describe("getUser()", () => {
    it("Returns a user for valid id", async () => {
      await userColl.insertMany(mockUsers);

      const user = await getUser("61495e3fb656d914455a2a38");

      expect(user?._id).toEqual(new ObjectId("61495e3fb656d914455a2a38"));
      expect(user?.githubId).toBe(123);
      expect(user?.displayName).toBe("testuser");
      expect(user?.githubAccessToken).toBeUndefined();
    });

    it("Returns null if user does not exist", async () => {
      await userColl.insertMany(mockUsers);

      const user = await getUser("61495e3fb656d914455a2a39");

      expect(user).toBeNull();
    });
  });

  describe("getAccessToken()", () => {
    it("Returns a users GitHub access token", async () => {
      await userColl.insertMany(mockUsers);

      const accessToken = await getAccessToken("61495e3fb656d914455a2a38");

      expect(accessToken).toBe("super-top-secret");
    });

    it("Returns null if user does not exist", async () => {
      await userColl.insertMany(mockUsers);

      const accessToken = await getAccessToken("61495e3fb656d914455a2a39");

      expect(accessToken).toBeNull();
    });
  });
});
