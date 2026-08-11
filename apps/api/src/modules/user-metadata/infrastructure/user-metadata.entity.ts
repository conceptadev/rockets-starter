import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { BaseUserMetadataEntityInterface } from '@concepta/rockets';

@Entity('user_metadata')
export class UserMetadataEntity implements BaseUserMetadataEntityInterface {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  userId!: string;

  @CreateDateColumn()
  dateCreated!: Date;

  @UpdateDateColumn()
  dateUpdated!: Date;

  @Column({ nullable: true })
  dateDeleted!: Date | null;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;
}
