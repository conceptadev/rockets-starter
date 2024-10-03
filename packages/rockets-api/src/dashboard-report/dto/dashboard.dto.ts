import { ReportCreateDto } from '@concepta/nestjs-report';
import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
export class DashboardCreateDto extends PickType(ReportCreateDto, [
  'name',
] as const) {}
