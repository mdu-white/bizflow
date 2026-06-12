import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";
import { AuditService } from "../audit/audit.service";

import { CreateContractorDto } from "./dto/create-contractor.dto";
import { UpdateContractorDto } from "./dto/update-contractor.dto";
import { ContractorStatus } from "@prisma/client";

@Injectable()
export class ContractorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService,
    private readonly auditService: AuditService
  ) {}

  async create(
    userId: string,
    dto: CreateContractorDto
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    if (dto.projectId) {
      const project =
        await this.prisma.project.findFirst({
          where: {
            id: dto.projectId,
            organizationId,
            deletedAt: null
          }
        });

      if (!project) {
        throw new NotFoundException(
          "Project not found"
        );
      }
    }

    const contractor =
      await this.prisma.contractor.create({
        data: {
          organizationId,
          ...dto
        }
      });

    await this.auditService.createEvent(
      organizationId,
      userId,
      "CONTRACTOR",
      contractor.id,
      "CONTRACTOR_CREATED",
      {
        name: contractor.name,
        status: contractor.status
      }
    );

    return contractor;
  }

  async findAll(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    return this.prisma.contractor.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      include: {
        project: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findOne(
    userId: string,
    contractorId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    const contractor =
      await this.prisma.contractor.findFirst({
        where: {
          id: contractorId,
          organizationId,
          deletedAt: null
        },
        include: {
          project: true
        }
      });

    if (!contractor) {
      throw new NotFoundException(
        "Contractor not found"
      );
    }

    return contractor;
  }

  async update(
    userId: string,
    contractorId: string,
    dto: UpdateContractorDto
  ) {
    const contractor =
      await this.findOne(
        userId,
        contractorId
      );

    if (dto.projectId) {
      const project =
        await this.prisma.project.findFirst({
          where: {
            id: dto.projectId,
            organizationId: contractor.organizationId,
            deletedAt: null
          }
        });

      if (!project) {
        throw new NotFoundException(
          "Project not found"
        );
      }
    }

    const updated =
      await this.prisma.contractor.update({
        where: {
          id: contractor.id
        },
        data: dto
      });

    await this.auditService.createEvent(
      contractor.organizationId,
      userId,
      "CONTRACTOR",
      contractor.id,
      "CONTRACTOR_UPDATED",
      dto
    );

    return updated;
  }

  async terminate(
    userId: string,
    contractorId: string
  ) {
    const contractor =
      await this.findOne(
        userId,
        contractorId
      );

    if (contractor.status === ContractorStatus.TERMINATED) {
      throw new BadRequestException(
        "Contractor is already terminated"
      );
    }

    const terminated =
      await this.prisma.contractor.update({
        where: {
          id: contractor.id
        },
        data: {
          status: ContractorStatus.TERMINATED
        }
      });

    await this.auditService.createEvent(
      contractor.organizationId,
      userId,
      "CONTRACTOR",
      contractor.id,
      "CONTRACTOR_TERMINATED"
    );

    return terminated;
  }

  async remove(
    userId: string,
    contractorId: string
  ) {
    const contractor =
      await this.findOne(
        userId,
        contractorId
      );

    const deleted =
      await this.prisma.contractor.update({
        where: {
          id: contractor.id
        },
        data: {
          deletedAt: new Date()
        }
      });

    await this.auditService.createEvent(
      contractor.organizationId,
      userId,
      "CONTRACTOR",
      contractor.id,
      "CONTRACTOR_DELETED"
    );

    return deleted;
  }
}