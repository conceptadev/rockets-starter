import { Entity, ManyToOne } from 'typeorm';
import { InvitationPostgresEntity } from '@concepta/nestjs-invitation';
import { UserEntity } from './user.entity';
import { ReferenceIdInterface } from '@concepta/ts-core';

@Entity('invitation')
export class InvitationEntity extends InvitationPostgresEntity {
  @ManyToOne(() => UserEntity, (user) => user.invitations)
  user!: ReferenceIdInterface;
}
