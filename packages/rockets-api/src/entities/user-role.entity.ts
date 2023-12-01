import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/ts-core';
import { RoleInterface } from '@concepta/ts-common';
import { RoleAssignmentPostgresEntity } from '@concepta/nestjs-role';

import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('user_role')
export class UserRoleEntity extends RoleAssignmentPostgresEntity {
  @ManyToOne(() => RoleEntity, (role) => role.assignees)
  role!: RoleInterface;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  assignee!: ReferenceIdInterface;
}
