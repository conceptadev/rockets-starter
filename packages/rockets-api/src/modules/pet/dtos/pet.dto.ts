import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PetInterface } from '../interfaces/pet.interface';
import { UserDto } from '../../user/dtos/user.dto';

@Exclude()
export class PetDto implements PetInterface {
  @Expose()
  @ApiProperty()
  @IsDefined()
  id!: string;

  @Expose()
  @ApiProperty()
  @IsString()
  name!: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  age!: number;

  @Expose()
  @ApiProperty()
  @IsString()
  breed!: string;

  @Expose()
  @ApiProperty()
  @IsString()
  color!: string;

  @Expose()
  @ApiProperty()
  @IsUUID()
  userId!: string;

  @Expose()
  @ApiPropertyOptional({
    type: () => UserDto,
    title: 'Pet owner user',
  })
  @Type(() => UserDto)
  @IsOptional()
  user?: UserDto;
}
