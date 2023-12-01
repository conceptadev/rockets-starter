import { Entity, ManyToOne } from 'typeorm';
import { OrgMemberPostgresEntity } from '@concepta/nestjs-org/dist/entities/org-member-postgres.entity';
import { OrgEntity } from './org.entity';
import { UserEntity } from './user.entity';

@Entity('org_member')
export class OrgMemberEntity extends OrgMemberPostgresEntity {
  @ManyToOne(() => OrgEntity, (org) => org.orgMembers, {
    nullable: false,
  })
  org!: OrgEntity;

  @ManyToOne(() => UserEntity, (user) => user.orgMembers, {
    nullable: false,
  })
  user!: UserEntity;
}
