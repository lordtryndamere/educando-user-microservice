import {
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PinCommandsRepository } from 'src/domain/repositories';
import { PinCommandsImplement } from 'src/infrastructure/repositories/pin-commands';

export class UpdatePinStatusCommand implements ICommand {
  constructor(readonly idPin: string, readonly status: number) {}
}

@CommandHandler(UpdatePinStatusCommand)
export class UpdatePinStatusHandler
  implements ICommandHandler<UpdatePinStatusCommand, void>
{
  constructor(
    @Inject(PinCommandsImplement)
    private readonly pinCommandsRepository: PinCommandsRepository,
    private readonly logger: Logger,
  ) {}
  async execute({ idPin, status }: UpdatePinStatusCommand): Promise<void> {
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
        'UpdatePinStatusHandler.execute',
      );
      throw new NotFoundException(
        `pin with id : ${idPin}, was not found in database`,
      );
    }
    findPinById.value.updateStatus(idPin, status);
    await this.pinCommandsRepository.updateStatus(idPin, status);
    findPinById.value.commit();
  }
}
