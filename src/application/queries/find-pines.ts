import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinQueriesRepository } from 'src/domain/repositories';
import { PinQueriesImplements } from 'src/infrastructure/repositories/pin-queries';

export class FindPinesQuery implements IQuery {}

@QueryHandler(FindPinesQuery)
export class FindPinesQueryHandler implements IQueryHandler<FindPinesQuery> {
  constructor(
    @Inject(PinQueriesImplements)
    readonly pinQuery: PinQueriesRepository,
  ) {}
  async execute(): Promise<Pines> {
    return this.pinQuery.get();
  }
}
