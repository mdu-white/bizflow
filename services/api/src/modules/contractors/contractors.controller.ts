import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { ContractorsService } from "./contractors.service";

import { CreateContractorDto } from "./dto/create-contractor.dto";
import { UpdateContractorDto } from "./dto/update-contractor.dto";

@Controller("contractors")
@UseGuards(JwtAuthGuard)
export class ContractorsController {
  constructor(
    private readonly contractorsService: ContractorsService
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateContractorDto
  ) {
    return this.contractorsService.create(
      user.userId,
      dto
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: any
  ) {
    return this.contractorsService.findAll(
      user.userId
    );
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: any,
    @Param("id") id: string
  ) {
    return this.contractorsService.findOne(
      user.userId,
      id
    );
  }

  @Patch(":id")
  update(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: UpdateContractorDto
  ) {
    return this.contractorsService.update(
      user.userId,
      id,
      dto
    );
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: any,
    @Param("id") id: string
  ) {
    return this.contractorsService.remove(
      user.userId,
      id
    );
  }

    @Post(":id/terminate")
    terminate(
    @CurrentUser() user: any,
    @Param("id") id: string
    ) {
        return this.contractorsService.terminate(
        user.userId,
        id
        );
    }
}