import {
  ForbiddenException,
  Injectable
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrganizationContextService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async getOrganizationId(
    userId: string
  ) {
    const membership =
      await this.prisma.organizationMember.findFirst({
        where: {
          userId,
          status: "ACTIVE"
        }
      });

    if (!membership) {
      throw new ForbiddenException(
        "No active organization membership"
      );
    }

    return membership.organizationId;
  }
}