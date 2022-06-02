import { OrgPostgresEntity } from '@concepta/nestjs-org/dist/entities/org-postgres.entity';
import { Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('org')
export class OrgEntity extends OrgPostgresEntity {
  @ManyToOne(() => UserEntity, { nullable: true })
  owner: UserEntity;
}
