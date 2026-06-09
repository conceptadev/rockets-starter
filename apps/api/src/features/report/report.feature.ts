import { defineModuleResource } from '@bitwild/rockets';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

export const reportFeature = defineModuleResource({
  controllers: [ReportController],
  providers: [ReportService],
});
