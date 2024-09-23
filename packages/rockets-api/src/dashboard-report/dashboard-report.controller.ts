import { ReportService } from '@concepta/nestjs-report';
import { ReportInterface } from '@concepta/ts-common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { REPORT_KEY_DASHBOARD_REPORT } from './dashboard-report.constants';
import { DashboardCreateDto } from './dto/dashboard.dto';

@Controller('dashboard-report')
@ApiTags('dashboard-report')
export class DashboardController {
  constructor(private reportService: ReportService) {}

  @Post('')
  @ApiResponse({
    description: 'Create a report and return upload and download url',
  })
  async create(@Body() dto: DashboardCreateDto): Promise<ReportInterface> {
    return this.reportService.generate({
      ...dto,
      serviceKey: REPORT_KEY_DASHBOARD_REPORT,
    });
  }

  @Get(':id')
  @ApiResponse({
    description: 'Get report created',
  })
  async get(@Param('id') id: string): Promise<ReportInterface> {
    return this.reportService.fetch({
      id,
    });
  }
}
