import { ApiProperty } from '@nestjs/swagger';

export class ReportSummaryDto {
  @ApiProperty({ example: 3 })
  categoryCount!: number;

  @ApiProperty({ example: 12 })
  taskCount!: number;

  @ApiProperty({ example: 4 })
  openTaskCount!: number;
}
