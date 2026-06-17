import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";

import { createTestApp } from "./setup";

describe("Health Endpoint", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns healthy response", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/health");

    expect(response.status).toBe(200);
  });
});