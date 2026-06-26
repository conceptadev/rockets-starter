import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeatureEstimateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  @ApiProperty({ example: 'Add budget approval notifications' })
  readonly featureTitle!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  @ApiProperty({
    example:
      'Notify project owners when a new request fits the current available budget.',
  })
  readonly featureDescription!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '51447000000377349', required: false })
  readonly projectId?: string;
}
