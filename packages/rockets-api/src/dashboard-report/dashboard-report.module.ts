import { Module } from '@nestjs/common';
import { DashboardReportGeneratorService } from './dashboard-report-generator.service';
import { DashboardController } from './dashboard-report.controller';

@Module({
  imports: [],
  providers: [DashboardReportGeneratorService],
  exports: [DashboardReportGeneratorService],
  controllers: [DashboardController],
})
export class DashboardReportModule {}
