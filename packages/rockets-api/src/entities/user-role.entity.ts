import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/ts-core';
import { RoleInterface } from '@concepta/ts-common';
// TODO update this import when this bug was fixed
import { RoleAssignmentPostgresEntity } from '@concepta/nestjs-role/dist/entities/role-assignment-postgres.entity';

import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('user_role')
export class UserRoleEntity extends RoleAssignmentPostgresEntity {
  @ManyToOne(() => RoleEntity, (role) => role.assignees)
  role!: RoleInterface;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  assignee!: ReferenceIdInterface;
}
