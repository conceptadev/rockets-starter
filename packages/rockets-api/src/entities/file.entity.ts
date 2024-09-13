import { FilePostgresEntity } from '@concepta/nestjs-file';
import { Entity, OneToOne } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity('file')
export class FileEntity extends FilePostgresEntity {
  @OneToOne(() => ReportEntity, (report) => report.file)
  report!: ReportEntity;
}
