import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../modules/app.module";

describe("Clients E2E", () => {
  let app: INestApplication;
  let accessToken: string;
  let clientId: string;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

    app =
      moduleRef.createNestApplication();

    await app.init();

    const email =
      `client-test-${Date.now()}@example.com`;

    const password =
      "Password123!";

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password,
        name: "Client Test User",
        organizationName: "Client Test Org"
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

  it("creates a client", async () => {
    const response =
      await request(app.getHttpServer())
        .post("/clients")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          name: "Acme Corporation",
          contactName: "John Smith",
          email: "john@acme.com",
          phone: "0123456789"
        });

    expect(response.status)
      .toBe(201);

    expect(response.body.id)
      .toBeDefined();

    expect(response.body.name)
      .toBe("Acme Corporation");

    clientId =
      response.body.id;
  });

  it("lists clients", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/clients")
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
        (client: any) =>
          client.id === clientId
      )
    ).toBe(true);
  });

  it("gets a client by id", async () => {
    const response =
      await request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.id)
      .toBe(clientId);

    expect(response.body.name)
      .toBe("Acme Corporation");
  });

  it("updates a client", async () => {
    const response =
      await request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        )
        .send({
          name: "Acme Corporation Updated"
        });

    expect(response.status)
      .toBe(200);

    expect(response.body.name)
      .toBe(
        "Acme Corporation Updated"
      );
  });

  it("soft deletes a client", async () => {
    const response =
      await request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);
  });

  it("does not return deleted client in list", async () => {
    const response =
      await request(app.getHttpServer())
        .get("/clients")
        .set(
          "Authorization",
          `Bearer ${accessToken}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.some(
        (client: any) =>
          client.id === clientId
      )
    ).toBe(false);
  });
});