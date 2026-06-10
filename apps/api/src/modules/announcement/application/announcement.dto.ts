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
class AnnouncementFields {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Maintenance window' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @Expose()
  @ApiProperty({ example: 'API will be read-only on Sunday 02:00–04:00 UTC.' })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  dateCreated!: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  dateUpdated!: Date;
}

@Exclude()
class AnnouncementCreateFields {
  @Expose()
  @ApiProperty({ example: 'Maintenance window' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @Expose()
  @ApiProperty({ example: 'API will be read-only on Sunday 02:00–04:00 UTC.' })
  @IsString()
  @IsNotEmpty()
  body!: string;
}

@Exclude()
class AnnouncementUpdateFields extends PartialType(AnnouncementCreateFields) {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;
}

export class AnnouncementDto extends AnnouncementFields {}

export class AnnouncementCreateDto extends AnnouncementCreateFields {}

export class AnnouncementUpdateDto extends IntersectionType(
  PickType(AnnouncementUpdateFields, ['id'] as const),
  PartialType(PickType(AnnouncementCreateFields, ['title', 'body'] as const)),
) {}
