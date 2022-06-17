import { Entity, ManyToOne } from 'typeorm';
import { RoleAssignmentPostgresEntity } from '@concepta/nestjs-role/dist/entities/role-assignment-postgres.entity';
import { RoleEntityInterface } from '@concepta/nestjs-role/dist/interfaces/role-entity.interface';
import { RoleAssigneeInterface } from '@concepta/nestjs-role/dist/interfaces/role-assignee.interface';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('user_role')
export class UserRoleEntity extends RoleAssignmentPostgresEntity {
  @ManyToOne(() => RoleEntity, (role) => role.assignees)
  role!: RoleEntityInterface;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  assignee!: RoleAssigneeInterface;
}
