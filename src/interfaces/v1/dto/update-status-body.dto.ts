import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateStatusBodyDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly status: number;
}
