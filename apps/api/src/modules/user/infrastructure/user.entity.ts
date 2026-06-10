import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppUserRole } from '../../../shared/domain/user-role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: AppUserRole.USER,
  })
  role!: AppUserRole;

  @CreateDateColumn()
  dateCreated!: Date;
}
