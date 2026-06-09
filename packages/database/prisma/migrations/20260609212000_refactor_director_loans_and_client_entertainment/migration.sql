CREATE TYPE "DirectorLoanTransactionType" AS ENUM ('DRAWDOWN', 'REPAYMENT', 'ADJUSTMENT');

CREATE TABLE "DirectorLoanAccount" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "directorExternalRef" TEXT,
    "status" "DirectorLoanStatus" NOT NULL DEFAULT 'OPEN',
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "openingBalanceCents" INTEGER NOT NULL DEFAULT 0,
    "currentBalanceCents" INTEGER NOT NULL DEFAULT 0,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DirectorLoanAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DirectorLoanTransaction" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "DirectorLoanTransactionType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "balanceAfterCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DirectorLoanTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientEntertainment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "venue" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "attendees" JSONB NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "outcome" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClientEntertainment_pkey" PRIMARY KEY ("id")
);

INSERT INTO "DirectorLoanAccount" (
    "id",
    "organizationId",
    "directorName",
    "status",
    "currency",
    "openingBalanceCents",
    "currentBalanceCents",
    "openedAt",
    "notes",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "organizationId",
    "directorName",
    "status",
    "currency",
    CASE WHEN "direction" = 'TO_COMPANY' THEN "principalCents" ELSE 0 END,
    "balanceCents",
    "issuedAt",
    "notes",
    "createdAt",
    "updatedAt"
FROM "DirectorLoan";

INSERT INTO "DirectorLoanTransaction" (
    "id",
    "organizationId",
    "accountId",
    "type",
    "amountCents",
    "balanceAfterCents",
    "currency",
    "occurredAt",
    "description",
    "createdAt",
    "updatedAt"
)
SELECT
    concat("id", '_opening'),
    "organizationId",
    "id",
    CASE WHEN "direction" = 'TO_COMPANY' THEN 'DRAWDOWN'::"DirectorLoanTransactionType" ELSE 'REPAYMENT'::"DirectorLoanTransactionType" END,
    "principalCents",
    "balanceCents",
    "currency",
    "issuedAt",
    'Migrated opening director loan transaction',
    "createdAt",
    "updatedAt"
FROM "DirectorLoan";

DROP TABLE "DirectorLoan";
DROP TYPE "DirectorLoanDirection";

CREATE INDEX "DirectorLoanAccount_organizationId_status_idx" ON "DirectorLoanAccount"("organizationId", "status");
CREATE INDEX "DirectorLoanAccount_organizationId_directorName_idx" ON "DirectorLoanAccount"("organizationId", "directorName");
CREATE INDEX "DirectorLoanAccount_organizationId_directorExternalRef_idx" ON "DirectorLoanAccount"("organizationId", "directorExternalRef");
CREATE INDEX "DirectorLoanTransaction_organizationId_occurredAt_idx" ON "DirectorLoanTransaction"("organizationId", "occurredAt");
CREATE INDEX "DirectorLoanTransaction_organizationId_type_idx" ON "DirectorLoanTransaction"("organizationId", "type");
CREATE INDEX "DirectorLoanTransaction_accountId_occurredAt_idx" ON "DirectorLoanTransaction"("accountId", "occurredAt");
CREATE INDEX "ClientEntertainment_organizationId_occurredAt_idx" ON "ClientEntertainment"("organizationId", "occurredAt");
CREATE INDEX "ClientEntertainment_clientId_idx" ON "ClientEntertainment"("clientId");
CREATE INDEX "ClientEntertainment_projectId_idx" ON "ClientEntertainment"("projectId");

ALTER TABLE "DirectorLoanAccount" ADD CONSTRAINT "DirectorLoanAccount_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectorLoanTransaction" ADD CONSTRAINT "DirectorLoanTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectorLoanTransaction" ADD CONSTRAINT "DirectorLoanTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "DirectorLoanAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClientEntertainment" ADD CONSTRAINT "ClientEntertainment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClientEntertainment" ADD CONSTRAINT "ClientEntertainment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClientEntertainment" ADD CONSTRAINT "ClientEntertainment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
