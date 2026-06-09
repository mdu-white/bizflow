import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");

describe("tenant schema", () => {
  it.each(["Client", "Project", "Transaction", "DirectorLoanAccount", "DirectorLoanTransaction", "ClientEntertainment", "Contractor"])(
    "%s is scoped to an organization",
    (model) => {
      const modelBlock = schema.match(new RegExp(`model ${model} \\{[\\s\\S]*?\\n\\}`))?.[0];
      expect(modelBlock).toContain("organizationId");
      expect(modelBlock).toContain("@@index([organizationId");
    }
  );
});
