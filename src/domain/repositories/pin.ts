import { Result } from 'neverthrow';
import { Pines } from 'src/application/queries/pin';
import { InfrastructureException } from 'src/infrastructure/exceptions';
import { Pin } from '../aggregates';
import { Pin as QueryPin } from '../../application/queries/pin';

export type SavePinResult = Result<Pin | Pin[], InfrastructureException>;

export type GetPinResult = Result<QueryPin[], InfrastructureException>;

export type GetPinByCodeResult = Result<QueryPin, InfrastructureException>;

export type GetPinesBySchoolResult = Result<Pines, InfrastructureException>;

export interface PinCommandsRepository {
  save(pin: Pin | Pin[]): Promise<SavePinResult>;
  update(idPin: string, idCourse: string, idGrade: string): Promise<void>;
  updateStatus(idPin: string, status: number): Promise<void>;
}

export interface PinQueriesRepository {
  get(): Promise<GetPinResult>;
  getByCode(code: string): Promise<GetPinByCodeResult>;
  getBySchool(idSchool: string): Promise<GetPinesBySchoolResult>;
}
