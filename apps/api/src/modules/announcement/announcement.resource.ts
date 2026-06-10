import { AuthPublic, defineResource } from '@bitwild/rockets';
import { AnnouncementEntity } from './infrastructure/announcement.entity';
import {
  AnnouncementCreateDto,
  AnnouncementDto,
  AnnouncementUpdateDto,
} from './application/announcement.dto';

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
