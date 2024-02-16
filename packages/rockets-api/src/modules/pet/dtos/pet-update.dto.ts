import { Exclude } from 'class-transformer';
import { PartialType, PickType } from '@nestjs/swagger';
import { PetDto } from './pet.dto';
import { PetUpdatableInterface } from '../interfaces/pet-updatatable.interface';

@Exclude()
export class PetUpdateDto
  extends PartialType(
    PickType(PetDto, ['name', 'age', 'breed', 'color'] as const),
  )
  implements PetUpdatableInterface {}
