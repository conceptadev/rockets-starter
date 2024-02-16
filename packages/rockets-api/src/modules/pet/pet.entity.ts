import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonPostgresEntity } from '@concepta/typeorm-common';
import { UserEntity } from '../../entities/user.entity';
import { UserDto } from '../user/dtos/user.dto';

@Entity('pet')
export class PetEntity extends CommonPostgresEntity {
  @Column({ type: 'citext' })
  name: string;

  @Column({ type: 'citext' })
  age: number;

  @Column({ type: 'citext' })
  breed: string;

  @Column({ type: 'citext' })
  color: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user?: UserDto;
}
