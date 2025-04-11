const request = require("supertest");
const app = require("../app");
const db = require("../db");

jest.mock("../db");

afterEach(() => {
    jest.resetAllMocks();
});

describe("GET /api/subscriptions", () => {
    it("should return a list of subscriptions", async () => {
        const fakeSubscriptions = [
            { userId: 1, newsletterId: 1 },
            { userId: 1, newsletterId: 2 }
        ];
        db.all.mockImplementation((query, params, callback) => {
            callback(null, fakeSubscriptions);
        });
        const res = await request(app).get("/api/subscriptions");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeSubscriptions);
    });

    it("should return 500 if db.all errors", async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(new Error("DB error"), null);
        });
        const res = await request(app).get("/api/subscriptions");
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});

describe("POST /api/subscriptions", () => {
    it("should return 400 if required fields are missing", async () => {
        const res = await request(app).post("/api/subscriptions").send({ userId: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("User ID and Newsletter ID are required");
    });

    it("should subscribe a user successfully", async () => {
        db.run.mockImplementation(function(query, params, callback) {
            callback(null);
        });
        const subscriptionData = { userId: 1, newsletterId: 2 };
        const res = await request(app).post("/api/subscriptions").send(subscriptionData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(subscriptionData);
    });

    it("should return 500 if db.run errors when creating subscription", async () => {
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error("DB error"));
        });
        const subscriptionData = { userId: 1, newsletterId: 2 };
        const res = await request(app).post("/api/subscriptions").send(subscriptionData);
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});

describe("DELETE /api/subscriptions", () => {
    it("should return 400 if required fields are missing", async () => {
        const res = await request(app).delete("/api/subscriptions").send({ userId: 1 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("User ID and Newsletter ID are required");
    });

    it("should unsubscribe a user successfully", async () => {
        db.run.mockImplementation(function(query, params, callback) {
            callback(null);
        });
        const subscriptionData = { userId: 1, newsletterId: 2 };
        const res = await request(app).delete("/api/subscriptions").send(subscriptionData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "Subscription removed",
            ...subscriptionData
        });
    });

    it("should return 500 if db.run errors when deleting subscription", async () => {
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error("DB error"));
        });
        const subscriptionData = { userId: 1, newsletterId: 2 };
        const res = await request(app).delete("/api/subscriptions").send(subscriptionData);
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
