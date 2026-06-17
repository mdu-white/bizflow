import request from "supertest";
import { INestApplication } from "@nestjs/common";

import { createTestApp } from "./setup";

describe("Dashboard E2E", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    const email =
      `dashboard-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Dashboard User",
        organizationName: "Dashboard Org"
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

  it("returns dashboard summary", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/dashboard")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body)
      .toHaveProperty(
        "activeClients"
      );

    expect(response.body)
      .toHaveProperty(
        "activeProjects"
      );

    expect(response.body)
      .toHaveProperty(
        "activeContractors"
      );

    expect(response.body)
      .toHaveProperty(
        "revenueThisMonthCents"
      );

    expect(response.body)
      .toHaveProperty(
        "expensesThisMonthCents"
      );

    expect(response.body)
      .toHaveProperty(
        "profitThisMonthCents"
      );

    expect(response.body)
      .toHaveProperty(
        "cashFlowThisMonthCents"
      );

    expect(response.body)
      .toHaveProperty(
        "directorLoanBalanceCents"
      );

    expect(response.body)
      .toHaveProperty(
        "topProjects"
      );

    expect(
      Array.isArray(
        response.body.topProjects
      )
    ).toBe(true);
  });
});