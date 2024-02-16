import { Exclude } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { PetDto } from './pet.dto';
import { PetCreateableInterface } from '../interfaces/pet-creatable.interface';

@Exclude()
export class PetCreateDto
  extends PickType(PetDto, ['name', 'age', 'breed', 'color', 'userId'] as const)
  implements PetCreateableInterface {}
