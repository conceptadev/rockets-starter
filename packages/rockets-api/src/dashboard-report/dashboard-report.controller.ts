import { ReportCreateDto, ReportService } from '@concepta/nestjs-report';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { REPORT_KEY_USER_REPORT } from './dashboard-report.constants';

@Controller('user-report')
@ApiTags('user-report')
export class UserReportController {
  constructor(private reportService: ReportService) {}

  @Post('')
  @ApiResponse({
    description: 'Create a report and return upload and download url',
  })
  async create(@Body() reportDto: ReportCreateDto) {
    return this.reportService.generate({
      ...reportDto,
      serviceKey: REPORT_KEY_USER_REPORT,
    });
  }

  @Get('')
  @ApiResponse({
    description: 'Get report created',
  })
  async get(reportId: string) {
    return this.reportService.fetch({
      id: reportId,
    });
  }
}
