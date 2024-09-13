import { ReportPostgresEntity } from '@concepta/nestjs-report';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity()
export class ReportEntity extends ReportPostgresEntity {
  @OneToOne(() => FileEntity, (file) => file.report)
  @JoinColumn()
  file!: FileEntity;
}
