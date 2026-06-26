import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeatureEstimateWorkflowOutput } from '../../workflows/application/budget-workflow.types';

@Entity('feature_estimates')
export class FeatureEstimateEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'integer' })
  sequence!: number;

  @Column({ type: 'varchar', length: 100 })
  projectId!: string;

  @Column({ type: 'varchar', length: 180 })
  featureTitle!: string;

  @Column({ type: 'text' })
  featureDescription!: string;

  @Column({ type: 'int' })
  estimatedHours!: number;

  @Column({ type: 'varchar', length: 20 })
  confidence!: FeatureEstimateWorkflowOutput['confidence'];

  @Column({ type: 'boolean' })
  canFitBudget!: boolean;

  @Column({ type: 'int' })
  budgetAvailableHours!: number;

  @Column({ type: 'simple-json' })
  codeAnalysis!: FeatureEstimateWorkflowOutput['codeAnalysis'];

  @Column({ type: 'text' })
  recommendation!: string;

  @CreateDateColumn()
  dateCreated!: Date;
}
