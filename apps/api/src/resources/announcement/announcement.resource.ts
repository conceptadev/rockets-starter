import { AuthPublic, defineResource } from '@bitwild/rockets';
import { AnnouncementEntity } from '../../entities/announcement.entity';
import {
  AnnouncementCreateDto,
  AnnouncementDto,
  AnnouncementUpdateDto,
} from './announcement.dto';

/**
 * Fully public CRUD — no auth guard, no owner hooks, no userId column.
 *
 * Contrast with category/task:
 * - those run AuthServerGuard (fake auth always passes in this starter)
 * - OwnerStampHook stamps userId from the actor overlay on writes
 *
 * `public: true` removes bearer-auth from Swagger; `@AuthPublic()` skips
 * the global AuthServerGuard on this controller.
 */
export const announcementResource = defineResource({
  entity: AnnouncementEntity,
  public: true,
  decorators: [AuthPublic()],
  dto: {
    response: AnnouncementDto,
    create: AnnouncementCreateDto,
    update: AnnouncementUpdateDto,
  },
});
