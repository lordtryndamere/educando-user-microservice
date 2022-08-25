export enum InfrastructureExceptionCode {
  Default = 'DEFAULT_INFRA_EXCEPTION',

  SavePinDatabaseException = 'SAVE_PIN_DATABASE_EXCEPTION',
  UpdatePinStatusDatabaseException = 'UPDATE_PIN_STATUS_DATABASE_EXCEPTION',
  FindQueryPinesDatabaseException = 'FIND_QUERY_PINES_DATABASE_EXCEPTION',
  FindPinDatabaseException = 'FIND_PIN_DATABASE_EXCEPTION',
  FindPinByCodeDatabaseException = 'FIND_PIN_BY_CODE_DATABASE_EXCEPTION',
  FindPinesBySchoolDatabaseException = 'FIND_PINES_BY_SCHOOL_DATABASE_EXCEPTION',
  FindPinByIDatabaseException = 'FIND_PIN_BY_ID_DATABASE_EXCEPTION',
}
export abstract class InfrastructureException extends Error {
  code: string;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InfrastructureException.prototype);

    this.code = InfrastructureExceptionCode.Default;
  }
}
