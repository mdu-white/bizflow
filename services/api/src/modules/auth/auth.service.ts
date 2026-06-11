import { ConflictException, Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash
      }
    });

    const organization = await this.prisma.organization.create({
      data: {
        name: dto.organizationName
      }
    });

    const membership =
      await this.prisma.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: "OWNER",
          status: "ACTIVE",
          joinedAt: new Date()
        }
      });

    return {
      user,
      organization,
      membership
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );

    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  };

  async me(userId: string) {
    const membership =
      await this.prisma.organizationMember.findFirst({
        where: {
          userId,
          status: "ACTIVE"
        },
        include: {
          user: true,
          organization: true
        }
      });

    if (!membership) {
      return null;
    }

    return {
      user: {
        id: membership.user.id,
        email: membership.user.email,
        name: membership.user.name
      },
      organization: {
        id: membership.organization.id,
        name: membership.organization.name
      },
      role: membership.role
    };
  }
}