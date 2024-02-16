import { PetInterface } from './pet.interface';

export interface PetCreateableInterface
  extends Pick<PetInterface, 'name' | 'age' | 'breed' | 'color' | 'userId'> {}
