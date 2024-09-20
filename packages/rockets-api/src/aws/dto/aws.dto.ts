import { FileCreateDto } from '@concepta/nestjs-file';
import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
export class AwsCreateDto extends PickType(FileCreateDto, [
  'fileName',
  'contentType',
] as const) {}
