import { defineModuleResource } from '@bitwild/rockets';
import { ReportController } from './application/report.controller';
import { ReportService } from './application/report.service';

export const reportFeature = defineModuleResource({
  controllers: [ReportController],
  providers: [ReportService],
});
