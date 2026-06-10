import {
  defineResource,
  OwnerScopeHook,
  OwnerStampHook,
} from '@bitwild/rockets';
import { TaskEntity } from './infrastructure/task.entity';
import {
  TaskCreateDto,
  TaskDto,
  TaskUpdateDto,
} from './application/task.dto';

export const taskResource = defineResource({
  entity: TaskEntity,
  dto: {
    response: TaskDto,
    create: TaskCreateDto,
    update: TaskUpdateDto,
  },
  hooks: [
    OwnerStampHook.for(TaskEntity),
    OwnerScopeHook.for(TaskEntity),
  ],
  operations: {
    list: {},
    read: {},
    create: {},
    update: {},
    delete: { soft: true },
  },
});
