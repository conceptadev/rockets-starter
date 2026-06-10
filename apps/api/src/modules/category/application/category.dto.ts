import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';

@Exclude()
class CategoryFields {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Work' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Work-related tasks' })
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId!: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  dateCreated!: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  dateUpdated!: Date;

  @Expose()
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  dateDeleted!: Date | null;

  @Expose()
  @ApiProperty()
  version!: number;
}

@Exclude()
class CategoryCreateFields {
  @Expose()
  @ApiProperty({ example: 'Work' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Work-related tasks' })
  @IsOptional()
  @IsString()
  description?: string;
}

@Exclude()
class CategoryUpdateFields extends PartialType(CategoryCreateFields) {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;
}

export class CategoryDto extends CategoryFields {}

export class CategoryCreateDto extends CategoryCreateFields {}

export class CategoryUpdateDto extends IntersectionType(
  PickType(CategoryUpdateFields, ['id'] as const),
  PartialType(PickType(CategoryCreateFields, ['name', 'description'] as const)),
) {}
