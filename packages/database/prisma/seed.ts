import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "owner@bizflow.co.za" },
    update: {},
    create: {
      email: "owner@bizflow.co.za",
      name: "BizFlow Owner"
    }
  });

  const organization = await prisma.organization.upsert({
    where: { registrationNo: "2026/123456/07" },
    update: {},
    create: {
      name: "Mdu White Consulting (Pty) Ltd",
      tradingName: "BizFlow Demo Co",
      registrationNo: "2026/123456/07",
      vatNumber: "4123456789",
      taxNumber: "9876543210"
    }
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: owner.id
      }
    },
    update: {
      role: "OWNER",
      status: "ACTIVE"
    },
    create: {
      organizationId: organization.id,
      userId: owner.id,
      role: "OWNER",
      status: "ACTIVE",
      joinedAt: new Date()
    }
  });

  const client = await prisma.client.upsert({
    where: {
      organizationId_name: {
        organizationId: organization.id,
        name: "Cape Retail Group"
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: "Cape Retail Group",
      contactName: "Anele Dlamini",
      email: "finance@caperetail.example",
      phone: "+27 21 555 0101",
      vatNumber: "4987654321"
    }
  });

  const project = await prisma.project.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "CRG-OPS-001"
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      clientId: client.id,
      code: "CRG-OPS-001",
      name: "Operations workflow rollout",
      status: "ACTIVE",
      budgetCents: 25000000,
      startsAt: new Date("2026-06-01T00:00:00.000Z")
    }
  });

  await prisma.contractor.create({
    data: {
      organizationId: organization.id,
      projectId: project.id,
      name: "Naledi Systems",
      email: "accounts@naledisystems.example",
      companyName: "Naledi Systems CC",
      taxNumber: "1234567890",
      monthlyRetainerCents: 4500000
    }
  });

  await prisma.transaction.createMany({
    data: [
      {
        organizationId: organization.id,
        clientId: client.id,
        projectId: project.id,
        createdByUserId: owner.id,
        type: "INCOME",
        status: "POSTED",
        occurredAt: new Date("2026-06-05T00:00:00.000Z"),
        description: "Project deposit invoice",
        amountCents: 8625000,
        vatRateBasisPts: 1500,
        vatAmountCents: 1125000,
        reference: "INV-0001"
      },
      {
        organizationId: organization.id,
        projectId: project.id,
        createdByUserId: owner.id,
        type: "EXPENSE",
        status: "POSTED",
        occurredAt: new Date("2026-06-06T00:00:00.000Z"),
        description: "Contractor retainer",
        amountCents: 4500000,
        vatRateBasisPts: 0,
        vatAmountCents: 0,
        reference: "SUP-0001"
      }
    ]
  });

  await prisma.directorLoan.create({
    data: {
      organizationId: organization.id,
      directorName: "Mdu White",
      direction: "TO_COMPANY",
      status: "OPEN",
      principalCents: 10000000,
      balanceCents: 10000000,
      issuedAt: new Date("2026-06-01T00:00:00.000Z"),
      notes: "Founder working capital injection"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
