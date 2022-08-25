import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePinBodyDTO {
  @IsString()
  @ApiProperty({ example: 'uuid' })
  readonly idGrade: string;
  @IsString()
  @ApiProperty({ example: 'uuid' })
  readonly idCourse: string;
}
