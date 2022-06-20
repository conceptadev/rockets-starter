import { Entity, OneToMany } from 'typeorm';
import { RolePostgresEntity } from '@concepta/nestjs-role/dist/entities/role-postgres.entity';
import { UserRoleEntity } from './user-role.entity';

@Entity('role')
export class RoleEntity extends RolePostgresEntity {
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles?: UserRoleEntity[];
}
