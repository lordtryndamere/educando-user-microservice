import {
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PinCommandsRepository } from 'src/domain/repositories';
import { PinCommandsImplement } from 'src/infrastructure/repositories/pin-commands';

export class UpdatePinCommand implements ICommand {
  constructor(
    readonly idPin: string,
    readonly idGrade: string,
    readonly idCourse: string,
  ) {}
}

@CommandHandler(UpdatePinCommand)
export class UpdatePinHandler
  implements ICommandHandler<UpdatePinCommand, void>
{
  constructor(
    @Inject(PinCommandsImplement)
    private readonly pinCommandsRepository: PinCommandsRepository,
    private readonly logger: Logger,
  ) {}
  async execute({ idPin, idCourse, idGrade }: UpdatePinCommand): Promise<void> {
    const findPinById = await this.pinCommandsRepository.findById(idPin);
    if (findPinById.isErr()) {
      this.logger.warn(findPinById.error);
      throw new InternalServerErrorException(
        findPinById.error.message,
        findPinById.error.name,
      );
    }
    if (!findPinById.value) {
      this.logger.warn(
        `pin with id : ${idPin}, was not found in database`,
        'UpdatePinHandler.execute',
      );
      throw new NotFoundException(
        `pin with id : ${idPin}, was not found in database`,
      );
    }
    findPinById.value.update(idPin, idCourse, idGrade);
    await this.pinCommandsRepository.update(idPin, idCourse, idGrade);
    findPinById.value.commit();
  }
}
