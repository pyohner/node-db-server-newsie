const request = require("supertest");
const app = require("../app");
const db = require("../db");
const bcrypt = require("bcrypt");

// Mock the database module so that tests don't hit the real database.
jest.mock("../db");

afterEach(() => {
    jest.resetAllMocks();
});

describe("GET /api/users", () => {
    it("should return a list of users", async () => {
        const fakeUsers = [
            { id: 1, username: "user1", password: "hashed1", email: "user1@test.com" },
            { id: 2, username: "user2", password: "hashed2", email: "user2@test.com" }
        ];
        db.all.mockImplementation((query, params, callback) => {
            callback(null, fakeUsers);
        });

        const res = await request(app).get("/api/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeUsers);
    });

    it("should return 500 if db.all errors", async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(new Error("DB error"), null);
        });
        const res = await request(app).get("/api/users");
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});

describe("POST /api/users", () => {
    it("should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/users").send({
            username: "user1"
            // Missing password and email
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username, password, and email are required");
    });

    it("should create a new user successfully", async () => {
        // Fake hashed password for testing.
        const fakeHashedPassword = "hashedpassword";
        jest.spyOn(bcrypt, "hash").mockResolvedValue(fakeHashedPassword);

        // Simulate a successful database insert by setting this.lastID.
        db.run.mockImplementation((query, params, callback) => {
            callback.call({ lastID: 123 }, null);
        });


        const res = await request(app).post("/api/users").send({
            username: "newuser",
            password: "password123",
            email: "newuser@test.com"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            id: 123,
            username: "newuser",
            email: "newuser@test.com"
        });
    });

    it("should return 500 if db.run fails when creating a user", async () => {
        const fakeHashedPassword = "hashedpassword";
        jest.spyOn(bcrypt, "hash").mockResolvedValue(fakeHashedPassword);

        db.run.mockImplementation((query, params, callback) => {
            callback(new Error("DB run error"));
        });
        const res = await request(app).post("/api/users").send({
            username: "newuser",
            password: "password123",
            email: "newuser@test.com"
        });
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
