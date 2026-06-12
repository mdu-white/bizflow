import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createEvent(
    organizationId: string,
    actorUserId: string | null,
    entityType: string,
    entityId: string,
    action: string,
    metadata?: unknown
  ) {
    try {
      return await this.prisma.auditEvent.create({
        data: {
          organizationId,
          actorUserId,
          entityType,
          entityId,
          action,
          metadata: metadata as any
        }
      });
    } catch (error) {
      console.error(
        "Audit event creation failed",
        error
      );

      return null;
    }
  }
}