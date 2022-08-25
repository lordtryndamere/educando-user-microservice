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
import {
  FindPinesItem,
  FindPinesResponseDTO,
} from 'src/interfaces/v1/dto/find-pines';
import { ItemInPines } from './pin';

export class FindPinesBySchoolQuery implements IQuery {
  constructor(readonly idSchool: string) {}
}
export class ItemInFindPinesResult {
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

@QueryHandler(FindPinesBySchoolQuery)
export class FindPinesBySchoolQueryHandler
  implements IQueryHandler<FindPinesBySchoolQuery, FindPinesResponseDTO>
{
  constructor(
    @Inject(PinQueriesImplements)
    readonly pinQuery: PinQueriesRepository,
  ) {}
  async execute({
    idSchool,
  }: FindPinesBySchoolQuery): Promise<FindPinesResponseDTO> {
    const pinQuery = await this.pinQuery.getBySchool(idSchool);
    if (pinQuery.isErr()) {
      throw new InternalServerErrorException(
        pinQuery.error.message,
        pinQuery.error.code,
      );
    }
    if (pinQuery.value.length === 0)
      throw new NotFoundException(ErrorMessage.PIN_NOT_FOUND);
    return new FindPinesResponseDTO(
      pinQuery.value.map(this.filterResultProperties),
    );
  }
  private filterResultProperties(data: ItemInPines): FindPinesItem {
    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new ItemInFindPinesResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return new FindPinesItem(
      data.idPin,
      data.code,
      data.expirationDate,
      data.status,
      data.idCourse,
      data.idGrade,
      data.idSchool,
      data.createdAt,
      data.updatedAt,
    );
  }
}
