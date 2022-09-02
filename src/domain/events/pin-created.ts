import { IEvent } from '@nestjs/cqrs';
import { PinEssentialProperties } from '../aggregates/pin';

export class PinCreatedEvent implements IEvent, PinEssentialProperties {
  readonly idPin: string;
  readonly code: string;
  readonly idCourse: string;
  readonly idGrade: string;
  readonly idSchool: string;
}
