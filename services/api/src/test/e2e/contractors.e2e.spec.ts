import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Contractors E2E", () => {
  let app: INestApplication;
  let accessToken: string;
  let contractorId: string;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

    app =
      moduleRef.createNestApplication();

    await app.init();

    const email =
      `contractor-test-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Contractor Test User",
        organizationName: "Contractor Test Org"
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

  it("creates a contractor", async () => {
    const response =
      await request(app.getHttpServer())
        .post("/contractors")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          name: "MK Nhlapo",
          email: "mk@example.com",
          hourlyRateCents: 45000
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();

    expect(response.body.name)
      .toBe("MK Nhlapo");

    contractorId =
      response.body.id;
  });

  it("lists contractors", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/contractors")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      Array.isArray(response.body)
    ).toBe(true);

    expect(
      response.body.some(
        (contractor: any) =>
          contractor.id === contractorId
      )
    ).toBe(true);
  });

  it("gets contractor by id", async () => {
    const response =
      await request(app.getHttpServer())
        .get(`/contractors/${contractorId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.id)
      .toBe(contractorId);
  });

  it("updates contractor", async () => {
    const response =
      await request(app.getHttpServer())
        .patch(`/contractors/${contractorId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          name: "MK Nhlapo Updated"
        });

    expect(response.status)
      .toBe(200);

    expect(response.body.name)
      .toBe("MK Nhlapo Updated");
  });

  it("terminates contractor", async () => {
    const response =
      await request(app.getHttpServer())
        .post(
          `/contractors/${contractorId}/terminate`
        )
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(201);

    expect(response.body.status)
      .toBe("TERMINATED");
  });

  it("soft deletes contractor", async () => {
    const response =
      await request(app.getHttpServer())
        .delete(`/contractors/${contractorId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);
  });

  it("does not return deleted contractor in list", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/contractors")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.some(
        (contractor: any) =>
          contractor.id === contractorId
      )
    ).toBe(false);
  });
});