import { Inject, Logger } from '@nestjs/common';
import { err, ok } from 'neverthrow';

import { Pin, PinFactory } from 'src/domain/aggregates';
import {
  findByIdResult,
  PinCommandsRepository,
  SavePinResult,
} from 'src/domain/repositories';

import { getConnection, getRepository } from 'typeorm';
import { PinEntity } from '../database/entities';
import {
  FindPinByIDatabaseException,
  FindPinDatabaseException,
  SavePinDatabaseException,
  UpdatePinStatusDatabaseException,
} from '../exceptions';

export class PinCommandsImplement implements PinCommandsRepository {
  constructor(
    @Inject(PinFactory) private readonly pinFactory: PinFactory,
    private readonly logger: Logger,
  ) {}

  async save(data: Pin | Pin[]): Promise<SavePinResult> {
    this.logger.log(`Saving pin ${data}`);
    try {
      const models = Array.isArray(data) ? data : [data];
      const entities: any = models.map((model) => this.modelToEntity(model));
      if (Array.isArray(data)) {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(PinEntity)
          .values(entities)
          .execute();
        return ok(data);
      }
      await getRepository(PinEntity).save(entities);
      return ok(data);
    } catch (error) {
      this.logger.error(error, null, 'PinCommandsImplement.save');
      return err(new SavePinDatabaseException());
    }
  }

  async update(idPin: string, idCourse: string, idGrade: string): Promise<any> {
    this.logger.log(`Updating pin with id ${idPin}`);
    try {
      const pin: any = await getRepository(PinEntity).findOne({
        where: { idPin },
      });
      if (!pin) {
        throw err(new FindPinDatabaseException());
      }
      pin.idCourse = idCourse;
      pin.idGrade = idGrade;
      await getRepository(PinEntity).save(pin);
    } catch (error) {
      this.logger.error(error, null, 'PinCommandsImplement.update');
      return err(new UpdatePinStatusDatabaseException());
    }
  }
  async updateStatus(idPin: string, status: number): Promise<any> {
    this.logger.log(
      `Updating pin status with status and id ${idPin}, ${status}`,
    );
    try {
      const pin: PinEntity = await getRepository(PinEntity).findOne({
        where: { idPin },
      });
      if (!pin) {
        throw err(new FindPinDatabaseException());
      }
      pin.status = status;
      await getRepository(PinEntity).save(pin);
    } catch (error) {
      this.logger.error(error, null, 'PinCommandsImplement.updateStatus');
      return err(new UpdatePinStatusDatabaseException());
    }
  }

  async findById(idPin: string): Promise<findByIdResult> {
    this.logger.log(`Getting pin by id ${idPin}`);
    try {
      const pin = await getRepository(PinEntity).findOne({
        where: { idPin },
      });

      if (!pin) return err(new FindPinByIDatabaseException());

      return ok(this.entityToModel(pin));
    } catch (error) {
      this.logger.error(
        error,
        null,
        'PintCommandsRepositoryImplement.findById',
      );
      return err(new FindPinByIDatabaseException());
    }
  }
  private modelToEntity(model: Pin) {
    const properties = model.properties();
    return {
      ...properties,
    };
  }

  private entityToModel(entity) {
    return this.pinFactory.reconstitute({
      ...entity,
    });
  }
}
