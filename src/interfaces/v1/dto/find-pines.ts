import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class FindPinesItem {
  @IsString()
  @ApiProperty({ example: 'PE-01901910' })
  readonly identifier: string = '';

  @IsString()
  @ApiProperty({ example: 'Julio Diaz' })
  readonly name: string = '';

  @IsBoolean()
  @ApiProperty({ example: 'PE' })
  readonly active: boolean = true;

  @IsString()
  @ApiProperty({ example: 'M' })
  readonly gender: string = '';

  constructor(
    identifier: string,
    name: string,
    active: boolean,
    gender: string,
  ) {
    this.identifier = identifier;
    this.name = name;
    this.active = active;
    this.gender = gender;
  }
}

export class FindPinesResponseDTO {
  @ApiProperty({ type: [FindPinesItem] })
  readonly pines: Array<FindPinesItem>;

  constructor(patients: Array<FindPinesItem>) {
    this.pines = patients;
  }
}
