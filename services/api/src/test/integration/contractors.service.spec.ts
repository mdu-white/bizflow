import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import { ContractorsService } from "../../modules/contractors/contractors.service";

describe(
  "ContractorsService",
  () => {

    let service: ContractorsService;

    const prisma = {
      contractor: {
        create: vi.fn(),
        update: vi.fn()
      },
      project: {
        findFirst: vi.fn()
      }
    };

    const organizationContext = {
      getOrganizationId: vi.fn()
    };

    const auditService = {
      createEvent: vi.fn()
    };

    beforeEach(() => {
      vi.clearAllMocks();

      service =
        new ContractorsService(
          prisma as any,
          organizationContext as any,
          auditService as any
        );
    });

    it(
      "creates a contractor",
      async () => {

        organizationContext.getOrganizationId.mockResolvedValue(
          "org-1"
        );

        prisma.contractor.create.mockResolvedValue(
          {
            id: "contractor-1",
            name: "John Developer",
            status: "ACTIVE"
          }
        );

        const result =
          await service.create(
            "user-1",
            {
              name: "John Developer"
            } as any
          );

        expect(
          result.name
        ).toBe(
          "John Developer"
        );

        expect(
          prisma.contractor.create
        ).toHaveBeenCalledOnce();
      }
    );

    it(
      "updates a contractor",
      async () => {

        vi.spyOn(
          service,
          "findOne"
        ).mockResolvedValue(
          {
            id: "contractor-1",
            organizationId: "org-1"
          } as any
        );

        prisma.contractor.update.mockResolvedValue(
          {
            id: "contractor-1",
            monthlyRetainerCents: 9000000
          }
        );

        const result =
          await service.update(
            "user-1",
            "contractor-1",
            {
              monthlyRetainerCents:
                9000000
            } as any
          );

        expect(
          result.monthlyRetainerCents
        ).toBe(
          9000000
        );
      }
    );

    it(
      "terminates a contractor",
      async () => {

        vi.spyOn(
          service,
          "findOne"
        ).mockResolvedValue(
          {
            id: "contractor-1",
            organizationId: "org-1",
            status: "ACTIVE"
          } as any
        );

        prisma.contractor.update.mockResolvedValue(
          {
            id: "contractor-1",
            status: "TERMINATED"
          }
        );

        const result =
          await service.terminate(
            "user-1",
            "contractor-1"
          );

        expect(
          result.status
        ).toBe(
          "TERMINATED"
        );
      }
    );

    it(
      "soft deletes a contractor",
      async () => {

        vi.spyOn(
          service,
          "findOne"
        ).mockResolvedValue(
          {
            id: "contractor-1",
            organizationId: "org-1"
          } as any
        );

        prisma.contractor.update.mockResolvedValue(
          {
            id: "contractor-1",
            deletedAt:
              new Date()
          }
        );

        const result =
          await service.remove(
            "user-1",
            "contractor-1"
          );

        expect(
          result.deletedAt
        ).toBeDefined();
      }
    );
  }
);