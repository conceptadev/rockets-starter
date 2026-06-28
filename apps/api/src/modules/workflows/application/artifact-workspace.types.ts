export const ARTIFACT_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export interface ArtifactSummary {
  name: string;
  title: string;
  subtitle: string;
  updatedAt: number;
}

export interface PublishArtifactInput {
  name: string;
  flow: Record<string, unknown>;
  ui: Record<string, unknown>;
  overwrite?: boolean;
}
