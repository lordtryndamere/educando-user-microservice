import { Injectable, Logger } from '@nestjs/common';
import { err, ok } from 'neverthrow';
import { Pines, Pin } from 'src/application/queries/pin';
import {
  GetPinByCodeResult,
  GetPinesBySchoolResult,
  GetPinResult,
  PinQueriesRepository,
} from 'src/domain/repositories';
import { getRepository } from 'typeorm';
import { PinEntity } from '../database/entities';
import {
  FindPinByCodeDatabaseException,
  FindPinDatabaseException,
  FindPinesBySchoolDatabaseException,
} from '../exceptions';

@Injectable()
export class PinQueriesImplements implements PinQueriesRepository {
  constructor(private readonly logger: Logger) {}

  async getBySchool(idSchool: string): Promise<GetPinesBySchoolResult> {
    this.logger.log(`Getting pin by school ${idSchool}`);
    try {
      const pins = await getRepository(PinEntity).find({
        where: { idSchool },
      });

      if (!pins || pins.length === 0)
        return err(new FindPinesBySchoolDatabaseException());

      return ok(this.convertPinsFromEntities(pins));
    } catch (error) {
      this.logger.error(error, null, 'PinQueriesImplements.getBySchool');
      return err(new FindPinesBySchoolDatabaseException());
    }
  }
  async get(): Promise<GetPinResult> {
    this.logger.log(`Getting pin`);
    try {
      const pin = await getRepository(PinEntity).find({});

      if (!pin || pin.length === 0) return err(new FindPinDatabaseException());

      return ok(this.convertPinsFromEntities(pin));
    } catch (error) {
      this.logger.error(error, null, 'PinQueriesImplements.get');
      return err(new FindPinByCodeDatabaseException());
    }
  }
  async getByCode(code: string): Promise<GetPinByCodeResult> {
    this.logger.log(`Getting pin by code ${code}`);
    try {
      const pin = await getRepository(PinEntity).findOne({ where: { code } });

      if (!pin) return err(new FindPinByCodeDatabaseException());

      return ok(this.convertPinFromEntity(pin));
    } catch (error) {
      this.logger.error(error, null, 'PinQueriesImplements.getByCode');
      return err(new FindPinByCodeDatabaseException());
    }
  }

  private convertPinsFromEntities(entities: PinEntity[]): Pines {
    return entities.map((entity) => {
      return {
        ...entity,
      };
    });
  }
  private convertPinFromEntity(entity?: PinEntity): undefined | Pin {
    return entity
      ? {
          ...entity,
        }
      : undefined;
  }
}
