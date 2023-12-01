import { Entity, ManyToOne } from 'typeorm';
import { ReferenceIdInterface } from '@concepta/ts-core';
import { OtpPostgresEntity } from '@concepta/nestjs-otp';

import { UserEntity } from './user.entity';

@Entity('user_otp')
export class UserOtpEntity extends OtpPostgresEntity {
  @ManyToOne(() => UserEntity, (user) => user.userOtps)
  assignee!: ReferenceIdInterface;
}
