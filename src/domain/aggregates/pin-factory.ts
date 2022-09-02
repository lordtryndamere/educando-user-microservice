import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Result, err, ok } from 'neverthrow';
import { Status } from '../constants/constants';
import { PinCreatedEvent } from '../events/pin-created';
import { DomainException } from '../exceptions/domain';
import { PinExpirationDateShouldBeGreaterThanNowException } from '../exceptions/pin';
import { Pin, PinImplement, PinProperties } from './pin';

type createPinDomainResult = Result<Pin, DomainException>;

export class PinFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}
  create(
    idPin: string,
    idCourse: string,
    idGrade: string,
    idSchool: string,
    code: string,
    expirationDate: Date,
  ): createPinDomainResult {
    if (expirationDate < new Date())
      return err(new PinExpirationDateShouldBeGreaterThanNowException());

    const pin = new PinImplement({
      idPin,
      idCourse,
      idGrade,
      idSchool,
      code,
      expirationDate,
      status: Status.INACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const context = this.eventPublisher.mergeObjectContext(pin);
    pin.apply(Object.assign(new PinCreatedEvent(), pin));
    return ok(context);
  }
  reconstitute(properties: PinProperties): Pin {
    return this.eventPublisher.mergeObjectContext(new PinImplement(properties));
  }
}
