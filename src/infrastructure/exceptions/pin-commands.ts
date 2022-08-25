import {
  InfrastructureException,
  InfrastructureExceptionCode,
} from './infrastructure';

export class SavePinDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database when saving pin(s)',
  ) {
    super(message);
    Object.setPrototypeOf(this, SavePinDatabaseException.prototype);

    this.code = InfrastructureExceptionCode.SavePinDatabaseException;
  }
}
export class UpdatePinStatusDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database when updating status pin(s)',
  ) {
    super(message);
    Object.setPrototypeOf(this, UpdatePinStatusDatabaseException.prototype);

    this.code = InfrastructureExceptionCode.UpdatePinStatusDatabaseException;
  }
}
export class FindPinByIDatabaseException extends InfrastructureException {
  constructor(
    message = 'There was an error in the database finding pin by id',
  ) {
    super(message);
    Object.setPrototypeOf(this, FindPinByIDatabaseException.prototype);

    this.code = InfrastructureExceptionCode.FindPinByIDatabaseException;
  }
}
