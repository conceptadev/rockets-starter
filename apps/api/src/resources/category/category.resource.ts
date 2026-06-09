import { defineResource, OwnerStampHook } from '@bitwild/rockets';
import { CategoryEntity } from '../../entities/category.entity';
import { CategoryCreateDto, CategoryUpdateDto } from './category.dto';

export const categoryResource = defineResource({
  entity: CategoryEntity,
  dto: {
    create: CategoryCreateDto,
    update: CategoryUpdateDto,
  },
  hooks: [OwnerStampHook.for(CategoryEntity)],
});
