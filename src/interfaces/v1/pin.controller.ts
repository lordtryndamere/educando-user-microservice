import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePinCommmand } from 'src/application/commands';
import { UpdatePinCommand } from 'src/application/commands/update-pin-command';
import { UpdatePinStatusCommand } from 'src/application/commands/update-pin-status-command';
import { FindPinByCodeQuery, FindPinesQuery } from 'src/application/queries';
import { FindPinesBySchoolQuery } from 'src/application/queries/find-pin-by-school';
import { CreatePinBodyDTO } from './dto/create-pin-body.dto';
import { UpdatePinBodyDTO } from './dto/update-pin-body.dto';
import { UpdateStatusBodyDTO } from './dto/update-status-body.dto';
import { ResponseDescription } from './response-description';
@ApiTags('Pin')
@Controller('pin')
export class PinController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post('create')
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async create(@Body() body: CreatePinBodyDTO) {
    const command = new CreatePinCommmand(
      body.quantity,
      body.idCourse,
      body.idGrade,
      body.idSchool,
      body.expirationDate,
    );
    await this.commandBus.execute(command);
  }

  @Patch('update/:idPin')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async update(@Param('idPin') idPin: string, @Body() dto: UpdatePinBodyDTO) {
    const command = new UpdatePinCommand(idPin, dto.idGrade, dto.idCourse);
    await this.commandBus.execute(command);
  }
  @Patch('update-status/:idPin')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async updateStatus(
    @Param('idPin') idPin: string,
    @Body() dto: UpdateStatusBodyDTO,
  ) {
    const command = new UpdatePinStatusCommand(idPin, dto.status);
    await this.commandBus.execute(command);
  }
  @Get('find-all')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAll() {
    const query = new FindPinesQuery();
    await this.queryBus.execute(query);
  }
  @Get('find-by-code/:code')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findOneByCode(@Param('code') code: string) {
    const query = new FindPinByCodeQuery(code);
    await this.queryBus.execute(query);
  }
  @Get('find-by-code/:idSchool')
  @ApiResponse({ status: 200, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findBySchool(@Param('idSchool') idSchool: string) {
    const query = new FindPinesBySchoolQuery(idSchool);
    await this.queryBus.execute(query);
  }
}
