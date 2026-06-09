import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
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
import { TaskStatus } from '../../interfaces/task.interface';

@Exclude()
class TaskCreateFields {
  @Expose()
  @ApiProperty({ example: 'Write docs' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @Expose()
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

@Exclude()
class TaskUpdateFields extends PartialType(TaskCreateFields) {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;
}

export class TaskCreateDto extends TaskCreateFields {}

export class TaskUpdateDto extends IntersectionType(
  PickType(TaskUpdateFields, ['id'] as const),
  PartialType(
    PickType(TaskCreateFields, ['title', 'description', 'status', 'categoryId'] as const),
  ),
) {}
