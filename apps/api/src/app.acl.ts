import { AccessControl } from 'accesscontrol';
import { AppUserRole } from './shared/domain/user-role.enum';
import {
  FLOWS_ARTIFACT_RESOURCE,
  FLOWS_MCP_SERVER_RESOURCE,
} from './modules/workflows/workflows.resource-key';

const ac = new AccessControl();

// ── ADMIN ─────────────────────────────────────────────────────────────────────
ac.grant(AppUserRole.ADMIN)
  .resource(FLOWS_ARTIFACT_RESOURCE)
  .createAny()
  .readAny()
  .updateAny()
  .deleteAny();

ac.grant(AppUserRole.ADMIN)
  .resource(FLOWS_MCP_SERVER_RESOURCE)
  .createAny()
  .readAny()
  .updateAny()
  .deleteAny();

// ── USER ──────────────────────────────────────────────────────────────────────
ac.grant(AppUserRole.USER)
  .resource(FLOWS_ARTIFACT_RESOURCE)
  .readAny();

ac.grant(AppUserRole.USER)
  .resource(FLOWS_MCP_SERVER_RESOURCE)
  .readAny();

export const appAcl = ac;
