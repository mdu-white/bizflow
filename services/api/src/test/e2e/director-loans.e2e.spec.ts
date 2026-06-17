import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Director Loans E2E", () => {
  let app: INestApplication;
  let accessToken: string;
  let accountId: string;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

    app =
      moduleRef.createNestApplication();

    await app.init();

    const email =
      `director-loan-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Director Loan User",
        organizationName: "Director Loan Org"
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

  it("creates a director loan account", async () => {
    const response =
      await request(app.getHttpServer())
        .post("/director-loans")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          directorName: "MK Nhlapo",
          notes: "Test Account"
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();

    expect(response.body.directorName)
      .toBe("MK Nhlapo");

    accountId =
      response.body.id;
  });

  it("lists director loan accounts", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/director-loans")
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

  it("gets director loan account by id", async () => {
    const response =
      await request(app.getHttpServer())
        .get(`/director-loans/${accountId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.id)
      .toBe(accountId);
  });

  it("updates director loan account", async () => {
    const response =
      await request(app.getHttpServer())
        .patch(`/director-loans/${accountId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          notes: "Updated Test Account"
        });

    expect(response.status)
      .toBe(200);

    expect(response.body.notes)
      .toBe("Updated Test Account");
  });

  it("creates a drawdown transaction", async () => {
    const response =
      await request(app.getHttpServer())
        .post(
          `/director-loans/${accountId}/drawdown`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          amountCents: 100000,
          occurredAt: new Date().toISOString(),
          description: "Initial Drawdown"
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();
  });

  it("creates a repayment transaction", async () => {
    const response =
      await request(app.getHttpServer())
        .post(
          `/director-loans/${accountId}/repayment`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          amountCents: 25000,
          occurredAt: new Date().toISOString(),
          description: "Partial Repayment"
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();
  });

  it("returns account transactions", async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          `/director-loans/${accountId}/transactions`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      Array.isArray(response.body)
    ).toBe(true);

    expect(response.body.length)
      .toBeGreaterThan(0);
  });

  it("soft deletes director loan account", async () => {
    const response =
      await request(app.getHttpServer())
        .delete(
          `/director-loans/${accountId}`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);
  });

  it("does not return deleted account in list", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/director-loans")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.some(
        (account: any) =>
          account.id === accountId
      )
    ).toBe(false);
  });
});