import {
  auditableEntity,
  bindZodResources,
  f,
} from '@bitwild/rockets-core/zod';
import { typeOrmZodEntityCompiler } from '@bitwild/rockets-repository-typeorm/zod';

const { defineUserMetadata } = bindZodResources(typeOrmZodEntityCompiler);

export const userMetadataSchema = auditableEntity({
  userId: f.string({ max: 255 }),
  firstName: f.string({ min: 1, max: 100, example: 'John' }).optional(),
  lastName: f.string({ min: 1, max: 100, example: 'Doe' }).optional(),
});

export const userMetadata = defineUserMetadata(userMetadataSchema, {
  table: 'user_metadata',
});
