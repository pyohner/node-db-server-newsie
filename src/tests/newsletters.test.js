const request = require("supertest");
const app = require("../app");
const db = require("../db");

jest.mock("../db");

afterEach(() => {
    jest.resetAllMocks();
});

describe("GET /api/newsletters", () => {
    it("should return a list of newsletters", async () => {
        const fakeNewsletters = [
            { id: 1, name: "Newsletter 1", summary: "Summary 1" },
            { id: 2, name: "Newsletter 2", summary: "Summary 2" }
        ];

        db.all.mockImplementation((query, params, callback) => {
            callback(null, fakeNewsletters);
        });

        const res = await request(app).get("/api/newsletters");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeNewsletters);
    });

    it("should return 500 when db.all errors", async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(new Error("Error occurred"), null);
        });
        const res = await request(app).get("/api/newsletters");
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});

describe("GET /api/newsletters/:id", () => {
    it("should return a single newsletter if found", async () => {
        const fakeNewsletter = { id: 1, name: "Newsletter 1", summary: "Summary 1" };
        db.get.mockImplementation((query, params, callback) => {
            callback(null, fakeNewsletter);
        });
        const res = await request(app).get("/api/newsletters/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeNewsletter);
    });

    it("should return 404 if newsletter not found", async () => {
        db.get.mockImplementation((query, params, callback) => {
            callback(null, undefined);
        });
        const res = await request(app).get("/api/newsletters/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Newsletter not found");
    });
});

describe("POST /api/newsletters", () => {
    it("should return 400 when required fields are missing", async () => {
        // According to newsletters.js, both name and summary are required.
        const res = await request(app).post("/api/newsletters").send({
            name: "Newsletter without summary"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Title and summary are required");
    });

    it("should create a new newsletter successfully", async () => {
        db.run.mockImplementation((query, params, callback) => {
            callback.call({ lastID: 1 }, null);
        });


        const newsletterData = {
            name: "Newsletter 1",
            summary: "Summary of newsletter",
            category: "Tech",
            photo: "photo.jpg",
            frequency: "Weekly",
            description: "Full description here",
            featured: 1
        };

        const res = await request(app).post("/api/newsletters").send(newsletterData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            id: 1,
            ...newsletterData
        });
    });

    it("should return 500 when db.run fails creating a newsletter", async () => {
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error("DB error"));
        });
        const newsletterData = {
            name: "Newsletter 1",
            summary: "Summary of newsletter"
        };
        const res = await request(app).post("/api/newsletters").send(newsletterData);
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
