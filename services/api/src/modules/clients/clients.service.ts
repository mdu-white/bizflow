import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { OrganizationContextService } from "../common/services/organization-context.service";

@Injectable()
export class ClientsService {
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
    dto: CreateClientDto
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    return this.prisma.client.create({
      data: {
        organizationId,
        ...dto
      }
    });
  }

  async findAll(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    return this.prisma.client.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      orderBy: {
        name: "asc"
      }
    });
  }

    async findOne(
        userId: string,
        clientId: string
        ) {
        const organizationId =
            await this.organizationContext.getOrganizationId(userId);

        const client =
            await this.prisma.client.findFirst({
                where: {
                    id: clientId,
                    organizationId,
                    deletedAt: null
                }
            });

            if (!client) {
                throw new NotFoundException(
                "Client not found"
                );
            }

        return client;
    }

    async update(
        userId: string,
        clientId: string,
        dto: UpdateClientDto
        ) {
        await this.findOne(userId, clientId);

        return this.prisma.client.update({
            where: {
                id: clientId
            },
            data: dto
        });
    }

    async remove(
        userId: string,
        clientId: string
        ) {
        await this.findOne(userId, clientId);
        return this.prisma.client.update({
            where: {
                id: clientId
            },
            data: {
                deletedAt: new Date()
            }
        });
    }

    
}