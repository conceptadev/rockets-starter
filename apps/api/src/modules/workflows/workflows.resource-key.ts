export const FLOWS_ARTIFACT_RESOURCE = 'flows:artifact';
export const FLOWS_MCP_SERVER_RESOURCE = 'flows:mcp-server';

/** Generic micro-app record resource (rows in `artifact_record`). */
export const APPS_RECORD_RESOURCE = 'apps:record';

/**
 * Dynamic-repository key for `ArtifactRecordEntity`. Registered on the workflows
 * resource so Rockets exposes it via `@InjectDynamicRepository`.
 */
export const ARTIFACT_RECORD_ENTITY_KEY = 'artifactRecord';
