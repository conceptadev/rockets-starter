import { ReportPostgresEntity } from '@concepta/nestjs-report';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('report')
export class ReportEntity extends ReportPostgresEntity {
  @OneToOne(() => FileEntity)
  @JoinColumn()
  file!: FileEntity;
}
