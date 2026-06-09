import { describe, expect, it } from "vitest";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("returns API health", () => {
    expect(new HealthController().health()).toEqual({
      status: "ok",
      service: "bizflow-api"
    });
  });
});
