import { Entity, OneToMany } from 'typeorm';
import { UserPostgresEntity } from '@concepta/nestjs-user';
import { UserRoleEntity } from './user-role.entity';
import { UserOtpEntity } from './user-otp.entity';
import { InvitationEntity } from './invitation.entity';
import { OrgMemberEntity } from './org-member.entity';
import { OrgEntity } from './org.entity';
import { PetEntity } from '../modules/pet/pet.entity';

@Entity('user')
export class UserEntity extends UserPostgresEntity {
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.assignee)
  userRoles!: UserRoleEntity[];

  @OneToMany(() => UserOtpEntity, (userOtp) => userOtp.assignee)
  userOtps?: UserOtpEntity[];

  @OneToMany(() => OrgEntity, (org) => org.owner)
  orgs!: OrgEntity[];

  @OneToMany(() => OrgMemberEntity, (orgMember) => orgMember.org)
  orgMembers!: OrgMemberEntity[];

  @OneToMany(() => InvitationEntity, (invitation) => invitation.user)
  invitations?: InvitationEntity[];

  @OneToMany(() => PetEntity, (pet) => pet.user)
  pets?: PetEntity[];
}
