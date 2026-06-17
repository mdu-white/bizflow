import "reflect-metadata";

import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AppModule } from "../../modules/app.module";

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef =
    await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

  const app =
    moduleRef.createNestApplication();

  app.useGlobalFilters({
    catch(exception: any) {
      console.error("E2E EXCEPTION:", exception);
      throw exception;
    }
  } as any);

  await app.init();

  return app;
}