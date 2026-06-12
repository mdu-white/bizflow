import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { OrganizationContextService } from "../common/services/organization-context.service";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService
  ) {}

  private activeRecordFilter() {
    return {
      deletedAt: null
    };
  }

  async create(
    userId: string,
    dto: CreateProjectDto
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    if (dto.clientId) {
      const client =
        await this.prisma.client.findFirst({
          where: {
            id: dto.clientId,
            organizationId,
            deletedAt: null
          }
        });

      if (!client) {
        throw new NotFoundException(
          "Client not found"
        );
      }
    }

    return this.prisma.project.create({
      data: {
        organizationId,
        ...dto
      }
    });
  }

  async findAll(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    return this.prisma.project.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      include: {
        client: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findOne(
    userId: string,
    projectId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    const project =
      await this.prisma.project.findFirst({
        where: {
          id: projectId,
          organizationId,
          deletedAt: null
        },
        include: {
          client: true
        }
      });

    if (!project) {
      throw new NotFoundException(
        "Project not found"
      );
    }

    return project;
  }

  async update(
    userId: string,
    projectId: string,
    dto: UpdateProjectDto
  ) {
    await this.findOne(
      userId,
      projectId
    );

    return this.prisma.project.update({
      where: {
        id: projectId
      },
      data: dto
    });
  }

  async remove(
  userId: string,
  projectId: string
) {
  await this.findOne(
    userId,
    projectId
  );

  return this.prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      deletedAt: new Date()
    }
  });
}
}