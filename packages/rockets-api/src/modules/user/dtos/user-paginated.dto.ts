import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserPaginatedDto as _UserPaginatedDto } from '@concepta/nestjs-user';
import { UserDto } from './user.dto';

@Exclude()
export class UserPaginatedDto extends _UserPaginatedDto {
  @Expose()
  @ApiProperty({
    type: UserDto,
    isArray: true,
    description: 'Array of Users',
  })
  @Type(() => UserDto)
  data: UserDto[] = [];
}
