const request = require("supertest");
const app = require("../app");
const db = require("../db");
const bcrypt = require("bcrypt");

// Mock the database module to prevent real DB calls
jest.mock("../db");

// (Optional) Reset mocks between tests
afterEach(() => {
    jest.resetAllMocks();
});

describe("POST /api/login", () => {
    it("should return 400 if email or password are missing", async () => {
        const res = await request(app).post("/api/login").send({
            email: "test@example.com"
            // Missing password
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email and password are required");
    });

    it("should return 401 if user is not found", async () => {
        // Simulate that the user does not exist by invoking the callback with undefined
        db.get.mockImplementation((query, params, callback) => {
            callback(null, undefined);
        });

        const res = await request(app).post("/api/login").send({
            email: "nonexistent@example.com",
            password: "password123"
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid email or password");
    });

    it("should login successfully if credentials are valid", async () => {
        const hashedPassword = "hashedpassword"; // This can be a dummy value
        // Prepare a dummy user record
        const dummyUser = { id: 1, email: "user@example.com", password: hashedPassword };

        // Mock the db.get function to return the dummy user
        db.get.mockImplementation((query, params, callback) => {
            callback(null, dummyUser);
        });

        // Mock bcrypt.compare to simulate a successful password comparison
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        const res = await request(app).post("/api/login").send({
            email: "user@example.com",
            password: "password123"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.user.email).toBe("user@example.com");
        // Ensure the password field is not returned in the response
        expect(res.body.user.password).toBeUndefined();
    });
});
