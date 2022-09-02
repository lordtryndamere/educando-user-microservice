import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PinFactory } from 'src/domain/aggregates';
import { PinCommandsRepository } from 'src/domain/repositories';
import { PinCommandsImplement } from 'src/infrastructure/repositories/pin-commands';
import { v4 as uuidv4 } from 'uuid';
export class CreatePinCommmand implements ICommand {
  constructor(
    readonly quantity: number,
    readonly idCourse: string,
    readonly idGrade: string,
    readonly idSchool: string,
    readonly expirationDate: Date,
  ) {}
}

@CommandHandler(CreatePinCommmand)
export class CreatePinCommmandHandler
  implements ICommandHandler<CreatePinCommmand, any>
{
  constructor(
    @Inject(PinCommandsImplement)
    private readonly pinCommandRepository: PinCommandsRepository,
    private readonly pinFactory: PinFactory,
    private readonly logger: Logger,
  ) {}
  async execute(command: CreatePinCommmand): Promise<any> {
    const createdPines = [];
    //TODO: remake factory to receive array of pines and send event
    for (let index = 1; index <= command.quantity; index++) {
      const code = `${command.idGrade}${new Date().getTime().toFixed(4)}`;

      const idPin = uuidv4();
      const createResult = this.pinFactory.create(
        idPin,
        command.idCourse,
        command.idGrade,
        command.idSchool,
        code,
        command.expirationDate,
      );
      if (createResult.isErr()) {
        this.logger.warn(createResult.error, 'CreatePinHandler.execute');
        throw new BadRequestException(
          createResult.error.message,
          createResult.error.name,
        );
      }
      createResult.value.commit();

      createdPines.push(createResult.value);
    }
    const record = await this.pinCommandRepository.save(createdPines);
    if (record.isErr()) {
      throw new InternalServerErrorException(
        record.error.message,
        record.error.code,
      );
    }
    this.logger.log(`pines saved successfully`);
    return createdPines;
  }
}
