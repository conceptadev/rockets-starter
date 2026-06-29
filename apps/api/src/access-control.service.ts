import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AccessControlServiceInterface } from '@concepta/nestjs-access-control';
import type { AuthorizedUser } from '@bitwild/rockets';
import { AppUserRole } from './shared/domain/user-role.enum';

// Sentinel role for requests with no authenticated user.
// Has zero grants in app.acl.ts so AccessControlGuard returns false → 403.
// AuthServerGuard (running after app boot) returns 401 for truly missing tokens.
const ANONYMOUS_ROLE = '__anonymous__';

@Injectable()
export class AppAccessControlService implements AccessControlServiceInterface {
  async getUser(context: ExecutionContext): Promise<AuthorizedUser | undefined> {
    return context.switchToHttp().getRequest<{ user?: AuthorizedUser }>().user;
  }

  async getUserRoles(context: ExecutionContext): Promise<string[]> {
    const user = await this.getUser(context);
    if (!user) return [ANONYMOUS_ROLE];
    const roles = user.userRoles?.map((r) => r.role.name) ?? [];
    return roles.length > 0 ? roles : [AppUserRole.USER];
  }
}
