import { ReportModule } from '@concepta/nestjs-report';
import { Global, Module } from '@nestjs/common';
import { ReportEntity } from '../entities/report.entity';
import { UserReportGeneratorService } from './dashboard-report-generator.service';
import { UserReportController } from './dashboard-report.controller';
import { FileModule } from '@concepta/nestjs-file';

@Global()
@Module({
  imports: [
    ReportModule.registerAsync({
      // imports: [FileModule],
      inject: [UserReportGeneratorService],
      useFactory: (userReportGeneratorService: UserReportGeneratorService) => ({
        reportGeneratorServices: [userReportGeneratorService],
      }),
      entities: {
        report: {
          entity: ReportEntity,
        },
      },
    }),
  ],
  providers: [UserReportGeneratorService],
  exports: [UserReportGeneratorService],
  controllers: [UserReportController],
})
export class DashboardReportModule {}
