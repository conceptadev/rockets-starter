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
  /**
   * Optional micro-app schema (JSON Schema + x-* extensions). When present the
   * artifact becomes a micro-app: rows sync into `artifact_record` and the
   * generic resource at /apps/:app/records serves them.
   */
  schema?: Record<string, unknown>;
  overwrite?: boolean;
}
