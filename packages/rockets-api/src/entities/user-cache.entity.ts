import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/ts-core';
import { CachePostgresEntity } from '@concepta/nestjs-cache';
import { UserEntity } from './user.entity';

@Entity('user_cache')
export class UserCacheEntity extends CachePostgresEntity {
  @ManyToOne(() => UserEntity, (user) => user.userCaches)
  assignee!: ReferenceIdInterface;
}
