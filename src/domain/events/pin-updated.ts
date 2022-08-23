import { IEvent } from '@nestjs/cqrs';
import { PinEssentialProperties } from '../aggregates/pin';
import { PinId } from '../value-objects/pin-id';

export class PinUpdatedEvent implements IEvent, PinEssentialProperties {
  readonly idPin: string;
  readonly code: string;
  readonly idCourse: string;
  readonly idGrade: string;
  readonly idSchool: string;
}
