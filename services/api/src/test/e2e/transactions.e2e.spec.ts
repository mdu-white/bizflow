import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Transactions E2E", () => {
  let app: INestApplication;
  let accessToken: string;
  let transactionId: string;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

    app =
      moduleRef.createNestApplication();

    await app.init();

    const email =
      `transaction-test-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Transaction Test User",
        organizationName: "Transaction Test Org"
      });

    const loginResponse =
      await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email,
          password
        });

    accessToken =
      loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates a draft transaction", async () => {
    const response =
      await request(app.getHttpServer())
        .post("/transactions")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          type: "INCOME",
          description: "Test Income",
          amountCents: 100000,
          occurredAt: new Date().toISOString()
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();

    expect(response.body.status)
      .toBe("DRAFT");

    transactionId =
      response.body.id;
  });

  it("lists transactions", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/transactions")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      Array.isArray(response.body)
    ).toBe(true);
  });

  it("gets transaction by id", async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          `/transactions/${transactionId}`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.id)
      .toBe(transactionId);
  });

  it("updates draft transaction", async () => {
    const response =
      await request(app.getHttpServer())
        .patch(
          `/transactions/${transactionId}`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          description:
            "Updated Test Income"
        });

    expect(response.status)
      .toBe(200);

    expect(response.body.description)
      .toBe(
        "Updated Test Income"
      );
  });

  it("posts transaction", async () => {
    const response =
      await request(app.getHttpServer())
        .post(
          `/transactions/${transactionId}/post`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(201);

    expect(response.body.status)
      .toBe("POSTED");
  });

  it("voids transaction", async () => {
    const response =
      await request(app.getHttpServer())
        .post(
          `/transactions/${transactionId}/void`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          voidReason:
            "Automated E2E Test"
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.status)
      .toBe("VOID");
  });
});