import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../src/app";
import { Lead } from "../src/models/Lead";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await Lead.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Lead Tracker API", () => {
  test("creates a new lead", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({ name: "Jane Doe", email: "jane@example.com", phone: "1234567890" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Jane Doe");
    expect(res.body.status).toBe("New");
  });

  test("rejects a lead missing required fields", async () => {
    const res = await request(app).post("/api/leads").send({ name: "No Email" });
    expect(res.status).toBe(400);
  });

  test("lists leads", async () => {
    await Lead.create({ name: "Alice", email: "alice@example.com", phone: "111" });
    await Lead.create({ name: "Bob", email: "bob@example.com", phone: "222" });

    const res = await request(app).get("/api/leads");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test("searches leads by name, email or phone", async () => {
    await Lead.create({ name: "Alice", email: "alice@example.com", phone: "111" });
    await Lead.create({ name: "Bob", email: "bob@example.com", phone: "222" });

    const res = await request(app).get("/api/leads?search=alice");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Alice");
  });

  test("filters leads by status", async () => {
    await Lead.create({ name: "Alice", email: "alice@example.com", phone: "111", status: "Won" });
    await Lead.create({ name: "Bob", email: "bob@example.com", phone: "222", status: "New" });

    const res = await request(app).get("/api/leads?status=Won");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Alice");
  });

  test("updates a lead's status", async () => {
    const lead = await Lead.create({ name: "Alice", email: "alice@example.com", phone: "111" });

    const res = await request(app).patch(`/api/leads/${lead._id}/status`).send({ status: "Qualified" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Qualified");
  });

  test("rejects an invalid status", async () => {
    const lead = await Lead.create({ name: "Alice", email: "alice@example.com", phone: "111" });

    const res = await request(app).patch(`/api/leads/${lead._id}/status`).send({ status: "Bogus" });

    expect(res.status).toBe(400);
  });

  test("returns 404 when updating a non-existent lead", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).patch(`/api/leads/${fakeId}/status`).send({ status: "Won" });
    expect(res.status).toBe(404);
  });
});
