import {
  CourseEntity,
  GradeEntity,
  SchoolEntity,
} from 'src/infrastructure/database/entities';

export class Pin {
  readonly idPin: string;
  readonly code: string;
  readonly idCourse: CourseEntity;
  readonly idGrade: GradeEntity;
  readonly idSchool: SchoolEntity;
  readonly status: number;
  readonly expirationDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class ItemInPines {
  readonly idPin: string;
  readonly code: string;
  readonly idCourse: CourseEntity;
  readonly idGrade: GradeEntity;
  readonly idSchool: SchoolEntity;
  readonly status: number;
  readonly expirationDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export class Pines extends Array<ItemInPines> {}
