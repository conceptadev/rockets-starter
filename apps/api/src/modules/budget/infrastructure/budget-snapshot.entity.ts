import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  BudgetAlert,
  BudgetAccount,
  BudgetSource,
} from '../../workflows/application/budget-workflow.types';

@Entity('budget_snapshots')
export class BudgetSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'integer' })
  sequence!: number;

  @Column({ type: 'varchar', length: 80 })
  snapshotId!: string;

  @Column({ type: 'datetime' })
  capturedAt!: Date;

  @Column({ type: 'simple-json' })
  source!: BudgetSource;

  @Column({ type: 'simple-json', default: '[]' })
  alerts!: BudgetAlert[];

  @Column({ type: 'simple-json' })
  accounts!: BudgetAccount[];

  @CreateDateColumn()
  dateCreated!: Date;
}
