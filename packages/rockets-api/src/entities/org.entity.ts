import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrgPostgresEntity } from '@concepta/nestjs-org';
import { OrgMemberEntity } from './org-member.entity';
import { UserEntity } from './user.entity';

@Entity('org')
export class OrgEntity extends OrgPostgresEntity {
  @ManyToOne(() => UserEntity, (user) => user.orgs, { nullable: true })
  owner: UserEntity;

  @OneToMany(() => OrgMemberEntity, (orgMember) => orgMember.org)
  orgMembers!: OrgMemberEntity[];
}
