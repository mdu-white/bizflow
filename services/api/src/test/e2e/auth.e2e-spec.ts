import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Auth E2E", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

    app =
      moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers and logs in a user", async () => {
    const email =
      `test-${Date.now()}@example.com`;

    const password =
      "Password123!";

    const registerResponse =
      await request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email,
          password,
          name: "Test User",
          organizationName: "Test Organization"
        });

    expect(registerResponse.status)
      .toBe(201);

    const loginResponse =
      await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email,
          password
        });

    expect(loginResponse.status)
      .toBe(201);

    expect(
      loginResponse.body.accessToken
    ).toBeDefined();
  });
});