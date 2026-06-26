import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  BaseUserMetadataDto,
  type UserMetadataCreatableInterface,
  type UserMetadataModelUpdatableInterface,
} from '@bitwild/rockets';

@Exclude()
class UserMetadataFields extends BaseUserMetadataDto {
  @Expose()
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @Expose()
  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;
}

export class UserMetadataCreateDto
  extends PickType(UserMetadataFields, ['firstName', 'lastName'] as const)
  implements UserMetadataCreatableInterface
{
  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class UserMetadataUpdateDto
  extends PartialType(
    PickType(UserMetadataFields, ['firstName', 'lastName'] as const),
  )
  implements UserMetadataModelUpdatableInterface
{
  @ApiProperty({ example: 'userMetadata-123' })
  @IsString()
  @IsNotEmpty()
  id!: string;
}
