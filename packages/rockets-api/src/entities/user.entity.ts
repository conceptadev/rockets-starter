import { UserPostgresEntity } from '@concepta/nestjs-user/dist/entities/user-postgres.entity';
import { Entity, OneToMany } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity('user')
export class UserEntity extends UserPostgresEntity {
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.assignee)
  userRoles!: UserRoleEntity[];
}
