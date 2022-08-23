export enum DomainExceptionCode {
  Default = 'DOMAIN_000001',
  //

  PinIsAlreadyDesactivatedException = 'DOMAIN_000002',
  PinIsExpiredException = 'DOMAIN_000003',
  PinIsAlreadyUsedException = 'DOMAIN_000004',
  PinIsNotFoundException = 'DOMAIN_000005',
  PinExpirationDateShouldBeGreaterThanNowException = 'DOMAIN_000006',
}

export abstract class DomainException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, DomainException.prototype);

    this.name = DomainExceptionCode.Default;
  }
}
