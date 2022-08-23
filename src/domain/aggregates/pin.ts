import { AggregateRoot } from '@nestjs/cqrs';
import { Result, err, ok } from 'neverthrow';
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
  private _properties: PinProperties;
  private _status: number;
  private readonly _expirationDate: Date;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _idCourse: string;
  private _idGrade: string;
  private _idSchool: string;
  private readonly _idPin: string;
  private readonly _code: string;
  constructor(properties: PinProperties) {
    super();
    this._properties = properties;
    this._status = properties.status;
    this._expirationDate = properties.expirationDate;
    this._createdAt = properties.createdAt;
    this._updatedAt = properties.updatedAt;
    this._idCourse = properties.idCourse;
    this._idGrade = properties.idGrade;
    this._idSchool = properties.idSchool;
    this._idPin = properties.idPin;
    this._code = properties.code;
  }
  public properties = () => this._properties;
  public commit = () => {
    this._properties = {
      ...this._properties,
      status: this._status,
      expirationDate: this._expirationDate,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      idCourse: this._idCourse,
      idGrade: this._idGrade,
      idSchool: this._idSchool,
      idPin: this._idPin,
      code: this._code,
    };
  };
  public update = (idPin: string, idCourse: string, idGrade: string) => {
    this._idCourse = idCourse;
    this._idGrade = idGrade;
    this._updatedAt = new Date();
    this.apply(Object.assign(new PinUpdatedEvent(), this));
    this.commit();
    return ok(this);
  };
  public updateStatus = (idPin: string, status: number): updatePinStatus => {
    if (this._status === Status.DESACTIVATED)
      return err(new PinIsAlreadyDesactivatedException(this._idPin));
    this._status = status;
    this._updatedAt = new Date();
    this.apply(Object.assign(new PinUpdatedEvent(), this));
    this.commit();
    return ok(this);
  };
}
