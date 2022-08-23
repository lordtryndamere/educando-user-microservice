import {
  InfrastructureException,
  InfrastructureExceptionCode,
} from './infrastructure';

export class FindQueryPinesDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database when searching pines',
  ) {
    super(message);
    Object.setPrototypeOf(this, FindQueryPinesDatabaseException.prototype);

    this.code =
      InfrastructureExceptionCode.FindQueryPinesDatabaseException.toString();
  }
}

export class FindPinByCodeDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database when searching pin by code',
  ) {
    super(message);
    Object.setPrototypeOf(this, FindPinByCodeDatabaseException.prototype);

    this.code =
      InfrastructureExceptionCode.FindPinByCodeDatabaseException.toString();
  }
}

export class FindPinesBySchoolDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database when searching pines by school',
  ) {
    super(message);
    Object.setPrototypeOf(this, FindPinesBySchoolDatabaseException.prototype);

    this.code =
      InfrastructureExceptionCode.FindPinesBySchoolDatabaseException.toString();
  }
}

export class FindPinDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database when searching pin',
  ) {
    super(message);
    Object.setPrototypeOf(this, FindPinDatabaseException.prototype);

    this.code = InfrastructureExceptionCode.FindPinDatabaseException.toString();
  }
}
