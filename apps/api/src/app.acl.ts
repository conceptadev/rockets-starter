import { AccessControl } from 'accesscontrol';
import { AppUserRole } from './shared/domain/user-role.enum';
import {
  APPS_RECORD_RESOURCE,
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

// Micro-app records: ADMIN sees/edits everything across apps.
ac.grant(AppUserRole.ADMIN)
  .resource(APPS_RECORD_RESOURCE)
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

// Micro-app records: USER works on its own rows by default. Whether a read is
// scoped to the owner or visible app-wide is decided per app from `x-acl` and
// enforced in the resource service (readOwn grant lets the request through; the
// service widens to app-wide only when the app declares read: "any").
ac.grant(AppUserRole.USER)
  .resource(APPS_RECORD_RESOURCE)
  .createOwn()
  .readOwn()
  .updateOwn()
  .deleteOwn();

export const appAcl = ac;
