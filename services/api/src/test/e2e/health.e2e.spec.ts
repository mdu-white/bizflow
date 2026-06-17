import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Health E2E", () => {
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

  it("returns healthy response", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/health");

    expect(response.status)
      .toBe(200);

    expect(response.body).toEqual({
      status: "ok",
      service: "bizflow-api"
    });
  });
});