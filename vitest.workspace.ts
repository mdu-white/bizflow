import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "apps/web/vitest.config.ts",
  "services/api/vitest.config.ts",
  "packages/*/vitest.config.ts"
]);
