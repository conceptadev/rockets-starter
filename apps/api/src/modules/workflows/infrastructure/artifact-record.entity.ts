import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * One generic physical table for every micro-app's rows (the "dynamic tier").
 * No per-app DDL, no migration-per-app, no restart: a micro-app is just JSON,
 * and its installed schema drives validation + UI. Rows are scoped by `app`
 * (the artifact name) and an optional logical `entityKey`.
 *
 * - `data` holds the row, validated against the app's installed JSON Schema.
 * - `owner` is the userId of the writer, enabling Own/Any authorization.
 * - `businessKey` is the derived value of the schema's `x-primaryKey`, used to
 *   dedupe on `upsert`. Null for `append` (history/snapshot) rows.
 * - `version` records the schema version the row was written under.
 */
@Entity('artifact_record')
@Index(['app', 'entityKey'])
@Index(['app', 'owner'])
@Index(['app', 'entityKey', 'businessKey'])
export class ArtifactRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 128 })
  app!: string;

  @Column({ type: 'varchar', length: 128 })
  entityKey!: string;

  @Column({ type: 'simple-json' })
  data!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  owner!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  businessKey!: string | null;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @CreateDateColumn()
  capturedAt!: Date;

  @CreateDateColumn()
  dateCreated!: Date;

  @UpdateDateColumn()
  dateUpdated!: Date;

  @Column({ type: 'datetime', nullable: true })
  dateDeleted!: Date | null;
}
