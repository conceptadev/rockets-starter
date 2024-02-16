import { PetInterface } from './pet.interface';

export interface PetUpdatableInterface
  extends Partial<Pick<PetInterface, 'name' | 'age' | 'breed' | 'color'>> {}
