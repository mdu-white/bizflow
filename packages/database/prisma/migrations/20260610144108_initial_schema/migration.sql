-- DropForeignKey
ALTER TABLE "DirectorLoanTransaction" DROP CONSTRAINT "DirectorLoanTransaction_organizationId_fkey";

-- AlterTable
ALTER TABLE "ClientEntertainment" ADD COLUMN     "createdByUserId" TEXT,
ALTER COLUMN "attendees" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ClientEntertainment_createdByUserId_idx" ON "ClientEntertainment"("createdByUserId");

-- AddForeignKey
ALTER TABLE "ClientEntertainment" ADD CONSTRAINT "ClientEntertainment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
