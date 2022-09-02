import { AggregateRoot } from '@nestjs/cqrs';
import { Result, err } from 'neverthrow';
import { Status } from '../constants/constants';
import { PinUpdatedEvent } from '../events/pin-updated';
import { DomainException } from '../exceptions/domain';
import { PinIsAlreadyDesactivatedException } from '../exceptions/pin';

export type PinEssentialProperties = Required<{
  readonly idPin: string;
  readonly code: string;
  readonly idCourse: string;
  readonly idGrade: string;
  readonly idSchool: string;
}>;

export type PinOptionalProperties = Partial<{
  readonly status: number;
  readonly expirationDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}>;

export type PinProperties = PinEssentialProperties &
  Required<PinOptionalProperties>;

export interface Pin {
  properties: () => PinProperties;
  commit: () => void;
  update: (idPin: string, idCourse: string, idGrade: string) => void;
  updateStatus: (idPin: string, status: number) => void;
}

type updatePinStatus = Result<
  Pin,
  PinIsAlreadyDesactivatedException | DomainException
>;

export class PinImplement extends AggregateRoot implements Pin {
  private status: number;
  private readonly expirationDate: Date;
  private createdAt: Date;
  private updatedAt: Date;
  private idCourse: string;
  private idGrade: string;
  private idSchool: string;
  private readonly idPin: string;
  private readonly code: string;
  constructor(properties: PinEssentialProperties & PinOptionalProperties) {
    super();
    Object.assign(this, properties);
  }
  public properties = (): PinProperties => {
    return {
      idPin: this.idPin,
      code: this.code,
      status: this.status,
      idSchool: this.idSchool,
      idCourse: this.idCourse,
      idGrade: this.idGrade,
      expirationDate: this.expirationDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  public update = (idPin: string, idCourse: string, idGrade: string) => {
    this.idCourse = idCourse;
    this.idGrade = idGrade;
    this.updatedAt = new Date();
    this.apply(Object.assign(new PinUpdatedEvent(), this));
  };
  public updateStatus = (idPin: string, status: number): updatePinStatus => {
    if (this.status === Status.DESACTIVATED)
      return err(new PinIsAlreadyDesactivatedException(this.idPin));
    this.status = status;
    this.updatedAt = new Date();
    this.apply(Object.assign(new PinUpdatedEvent(), this));
  };
}
