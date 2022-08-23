import { DomainException } from './domain';

export class PinIsAlreadyDesactivatedException extends DomainException {
  constructor(pinId: string) {
    super(PinIsAlreadyDesactivatedException.getMessage(pinId));
  }
  static getMessage(id: string): string {
    return `pin with id : ${id}, is already desactivated`;
  }
}

export class PinIsExpiredException extends DomainException {
  constructor(pinId: string) {
    super(PinIsExpiredException.getMessage(pinId));
  }
  static getMessage(id: string): string {
    return `pin with id : ${id}, is already expired`;
  }
}

export class PinIsAlreadyUsedException extends DomainException {
  constructor(pinId: string) {
    super(PinIsAlreadyUsedException.getMessage(pinId));
  }
  static getMessage(id: string): string {
    return `pin with id : ${id}, is already used`;
  }
}

export class PinIsNotFoundException extends DomainException {
  constructor() {
    super(PinIsNotFoundException.getMessage());
  }
  static getMessage(): string {
    return `pin  not found`;
  }
}

export class PinExpirationDateShouldBeGreaterThanNowException extends DomainException {
  constructor() {
    super(PinExpirationDateShouldBeGreaterThanNowException.getMessage());
  }
  static getMessage(): string {
    return `pin expiration date should be greater than now`;
  }
}
