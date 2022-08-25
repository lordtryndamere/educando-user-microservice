import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorMessage } from 'src/domain/error';
import { PinQueriesRepository } from 'src/domain/repositories';
import {
  CourseEntity,
  GradeEntity,
  SchoolEntity,
} from 'src/infrastructure/database/entities';
import { PinQueriesImplements } from 'src/infrastructure/repositories/pin-queries';
import { FindPinResponseDTO } from 'src/interfaces/v1/dto/find-pin';

export class FindPinByCodeQuery implements IQuery {
  constructor(readonly code: string) {}
}
export class FindPinByCodeResult {
  readonly idPin: string;
  readonly code: string;
  readonly idCourse: CourseEntity;
  readonly idGrade: GradeEntity;
  readonly idSchool: SchoolEntity;
  readonly status: number;
  readonly expirationDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

@QueryHandler(FindPinByCodeQuery)
export class FindPinesByCodeQueryHandler
  implements IQueryHandler<FindPinByCodeQuery, FindPinResponseDTO>
{
  constructor(
    @Inject(PinQueriesImplements)
    readonly pinQuery: PinQueriesRepository,
  ) {}
  async execute({ code }: FindPinByCodeQuery): Promise<FindPinResponseDTO> {
    const pinQuery = await this.pinQuery.getByCode(code);
    if (pinQuery.isErr()) {
      throw new InternalServerErrorException(
        pinQuery.error.message,
        pinQuery.error.code,
      );
    }
    if (!pinQuery.value)
      throw new NotFoundException(ErrorMessage.PIN_NOT_FOUND);
    const data = pinQuery.value;
    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindPinByCodeResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return new FindPinResponseDTO(data);
  }
}
