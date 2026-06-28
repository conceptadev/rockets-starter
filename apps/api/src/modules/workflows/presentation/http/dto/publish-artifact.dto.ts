import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  ARTIFACT_NAME_PATTERN,
  PublishArtifactInput,
} from '../../../application/artifact-workspace.types';

export class PublishArtifactDto implements PublishArtifactInput {
  @IsString()
  @Matches(ARTIFACT_NAME_PATTERN, {
    message: 'name must contain only letters, numbers, underscores, or hyphens',
  })
  name!: string;

  @IsObject()
  flow!: Record<string, unknown>;

  @IsObject()
  ui!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  overwrite?: boolean;
}
