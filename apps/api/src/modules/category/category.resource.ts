import {
  defineResource,
  OwnerScopeHook,
  OwnerStampHook,
} from '@bitwild/rockets';
import { CategoryEntity } from './infrastructure/category.entity';
import {
  CategoryCreateDto,
  CategoryDto,
  CategoryUpdateDto,
} from './application/category.dto';

export const categoryResource = defineResource({
  entity: CategoryEntity,
  dto: {
    response: CategoryDto,
    create: CategoryCreateDto,
    update: CategoryUpdateDto,
  },
  hooks: [
    OwnerStampHook.for(CategoryEntity),
    OwnerScopeHook.for(CategoryEntity),
  ],
  operations: {
    list: {},
    read: {},
    create: {},
    update: {},
    delete: { soft: true },
  },
});
