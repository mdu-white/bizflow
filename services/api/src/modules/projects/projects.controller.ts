import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateProjectDto
  ) {
    return this.projectsService.create(
      user.userId,
      dto
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: any
  ) {
    return this.projectsService.findAll(
      user.userId
    );
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: any,
    @Param("id") id: string
  ) {
    return this.projectsService.findOne(
      user.userId,
      id
    );
  }

  @Patch(":id")
  update(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto
  ) {
    return this.projectsService.update(
      user.userId,
      id,
      dto
    );
  }
}