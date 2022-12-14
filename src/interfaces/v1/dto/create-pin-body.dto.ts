import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreatePinBodyDTO {
  @IsNumber()
  @ApiProperty({ example: 5 })
  readonly quantity: number;

  @IsString()
  @ApiProperty({ example: 'uuid' })
  readonly idSchool: string;
  @IsString()
  @ApiProperty({ example: 'uuid' })
  readonly idGrade: string;
  @IsString()
  @ApiProperty({ example: 'uuid' })
  readonly idCourse: string;
  @IsDateString()
  @ApiProperty({ example: '2022-01-03' })
  readonly expirationDate: Date;
}
