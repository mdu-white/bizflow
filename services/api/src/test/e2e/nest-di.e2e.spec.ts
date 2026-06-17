import "reflect-metadata";

import { Injectable } from "@nestjs/common";
import { Test } from "@nestjs/testing";

@Injectable()
class TestService {
  getValue() {
    return "working";
  }
}

@Injectable()
class ConsumerService {
  constructor(
    private readonly testService: TestService
  ) {}

  getValue() {
    return this.testService.getValue();
  }
}

describe("Nest DI", () => {
  it("resolves constructor injection", async () => {
    const moduleRef =
      await Test.createTestingModule({
        providers: [
          TestService,
          ConsumerService
        ]
      }).compile();

    const consumer =
      moduleRef.get(ConsumerService);

    expect(
      consumer.getValue()
    ).toBe("working");
  });
});