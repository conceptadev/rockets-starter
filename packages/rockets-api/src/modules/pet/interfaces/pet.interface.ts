import { UserDto } from '../../user/dtos/user.dto';

export interface PetInterface {
  name: string;
  age: number;
  breed: string;
  color: string;
  userId: string;
  user?: UserDto;
}
