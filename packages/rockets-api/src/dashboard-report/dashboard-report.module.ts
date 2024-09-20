import { Global, Module } from '@nestjs/common';
import { DashboardReportGeneratorService } from './dashboard-report-generator.service';
import { DashboardController } from './dashboard-report.controller';

@Global()
@Module({
  imports: [],
  providers: [DashboardReportGeneratorService],
  exports: [DashboardReportGeneratorService],
  controllers: [DashboardController],
})
export class DashboardReportModule {}
