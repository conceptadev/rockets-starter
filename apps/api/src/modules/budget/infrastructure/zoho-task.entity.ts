import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ZohoTask } from '../../workflows/application/zoho-tasks-workflow.types';

@Entity('zoho_tasks')
export class ZohoTaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  zohoId!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'varchar', length: 100 })
  projectId!: string;

  @Column({ type: 'varchar', length: 80, default: 'planning_ops' })
  bucketKey!: string;

  @Column({ type: 'varchar', length: 100 })
  requester!: string;

  @Column({ type: 'varchar', length: 20 })
  priority!: ZohoTask['priority'];

  @Column({ type: 'varchar', length: 20 })
  status!: ZohoTask['status'];

  @Column({ type: 'int', default: 0 })
  estimatedHours!: number;

  @Column({ type: 'int', default: 0 })
  loggedHours!: number;

  @Column({ type: 'datetime' })
  requestedAt!: Date;

  @CreateDateColumn()
  dateCreated!: Date;
}
