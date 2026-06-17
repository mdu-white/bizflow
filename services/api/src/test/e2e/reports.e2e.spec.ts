import request from "supertest";
import { INestApplication } from "@nestjs/common";

import { createTestApp } from "./setup";

describe("Reports E2E", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    const email =
      `reports-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Reports User",
        organizationName: "Reports Org"
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

  it("returns profit and loss report", async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          "/reports/profit-loss?from=2025-01-01&to=2030-12-31"
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body)
      .toHaveProperty(
        "incomeCents"
      );

    expect(response.body)
      .toHaveProperty(
        "expenseCents"
      );

    expect(response.body)
      .toHaveProperty(
        "profitCents"
      );
  });

  it("returns cash flow report", async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          "/reports/cash-flow?from=2025-01-01&to=2030-12-31"
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body)
      .toHaveProperty(
        "inflowCents"
      );

    expect(response.body)
      .toHaveProperty(
        "outflowCents"
      );

    expect(response.body)
      .toHaveProperty(
        "netCashFlowCents"
      );
  });

  it("returns director loan summary", async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          "/reports/director-loans"
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body)
      .toHaveProperty(
        "accounts"
      );

    expect(response.body)
      .toHaveProperty(
        "totalBalanceCents"
      );
  });

  it("returns project profitability", async () => {
    const response =
      await request(app.getHttpServer())
        .get(
          "/reports/project-profitability"
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
  });
});