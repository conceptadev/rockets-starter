import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CrudResponsePaginatedDto } from '@concepta/nestjs-crud';
import { PetInterface } from '../interfaces/pet.interface';
import { PetDto } from './pet.dto';

@Exclude()
export class PetPaginatedDto extends CrudResponsePaginatedDto<PetInterface> {
  @Expose()
  @ApiProperty({
    type: () => [PetDto],
    isArray: true,
    description: 'Array of Pets',
  })
  @Type(() => PetDto)
  data: PetDto[] = [];
}
