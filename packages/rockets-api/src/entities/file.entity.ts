import { FilePostgresEntity } from '@concepta/nestjs-file';
import { Entity } from 'typeorm';

@Entity('file')
export class FileEntity extends FilePostgresEntity {}
