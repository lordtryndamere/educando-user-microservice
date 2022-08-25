import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  CourseEntity,
  GradeEntity,
  SchoolEntity,
} from 'src/infrastructure/database/entities';

export class FindPinItem {
  @ApiProperty()
  @IsString()
  readonly idPin: string;
  @ApiProperty()
  @IsString()
  readonly code: string;
  @ApiProperty()
  @IsString()
  readonly idCourse: CourseEntity;
  @ApiProperty()
  @IsString()
  readonly idGrade: GradeEntity;
  @ApiProperty()
  @IsString()
  readonly idSchool: SchoolEntity;
  @ApiProperty()
  @IsNumber()
  readonly status: number;
  @ApiProperty()
  @IsDate()
  readonly expirationDate: Date;
  @ApiProperty()
  @IsDate()
  readonly createdAt: Date;
  @ApiProperty()
  @IsDate()
  readonly updatedAt: Date;

  constructor(
    idPin: string,
    code: string,
    expirationDate: Date,
    status: number,
    idCourse: CourseEntity,
    idGrade: GradeEntity,
    idSchool: SchoolEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.idPin = idPin;
    this.code = code;
    this.expirationDate = expirationDate;
    this.status = status;
    this.idCourse = idCourse;
    this.idGrade = idGrade;
    this.idSchool = idSchool;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class FindPinResponseDTO {
  @ApiProperty({ type: FindPinItem })
  readonly pin: FindPinItem;

  constructor(pin: FindPinItem) {
    this.pin = pin;
  }
}
