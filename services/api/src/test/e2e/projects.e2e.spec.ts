import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Projects E2E", () => {
  let app: INestApplication;
  let accessToken: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

    app =
      moduleRef.createNestApplication();

    await app.init();

    const email =
      `project-test-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Project Test User",
        organizationName: "Project Test Org"
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

  it("creates a project", async () => {
    const response =
      await request(app.getHttpServer())
        .post("/projects")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          name: "BizFlow Phase 1",
          code: "BF-P1",
          description:
            "Discovery and implementation",
          budgetCents: 15000000
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();

    expect(response.body.name)
      .toBe("BizFlow Phase 1");

    projectId =
      response.body.id;
  });

  it("lists projects", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/projects")
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
        (project: any) =>
          project.id === projectId
      )
    ).toBe(true);
  });

  it("gets a project by id", async () => {
    const response =
      await request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.id)
      .toBe(projectId);

    expect(response.body.name)
      .toBe("BizFlow Phase 1");
  });

  it("updates a project", async () => {
    const response =
      await request(app.getHttpServer())
        .patch(`/projects/${projectId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          name: "BizFlow Phase 1 Updated"
        });

    expect(response.status)
      .toBe(200);

    expect(response.body.name)
      .toBe(
        "BizFlow Phase 1 Updated"
      );
  });

  it("soft deletes a project", async () => {
    const response =
      await request(app.getHttpServer())
        .delete(`/projects/${projectId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);
  });

  it("does not return deleted project in list", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/projects")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.some(
        (project: any) =>
          project.id === projectId
      )
    ).toBe(false);
  });
});