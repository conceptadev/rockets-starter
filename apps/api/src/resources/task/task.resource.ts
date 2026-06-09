import { defineResource, OwnerStampHook } from '@bitwild/rockets';
import { TaskEntity } from '../../entities/task.entity';
import { TaskCreateDto, TaskUpdateDto } from './task.dto';

export const taskResource = defineResource({
  entity: TaskEntity,
  dto: {
    create: TaskCreateDto,
    update: TaskUpdateDto,
  },
  hooks: [OwnerStampHook.for(TaskEntity)],
});
