import { registerAs } from '@nestjs/config';
import { UserReportConfigInterface } from '../dashboard-report/interfaces/user-report.config.interface';


export const userReportConfig = registerAs(
  'AWS_MODULE_CONFIG',
  (): UserReportConfigInterface => {
    return {};
  },
);
