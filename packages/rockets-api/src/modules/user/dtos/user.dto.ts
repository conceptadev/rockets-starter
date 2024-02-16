import { Exclude, Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto as _UserDto } from '@concepta/nestjs-user';
import { PetDto } from '../../pet/dtos/pet.dto';

@Exclude()
export class UserDto extends _UserDto {
  @Expose()
  @ApiPropertyOptional({
    type: () => [PetDto],
    isArray: true,
  })
  @Type(() => PetDto)
  pets?: PetDto[];
}
