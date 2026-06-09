import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser, type AuthorizedUser } from '@bitwild/rockets';
import { ReportSummaryDto } from './report.dto';
import { ReportService } from './report.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get task and category counts for the current user' })
  @ApiResponse({ status: 200, type: ReportSummaryDto })
  getSummary(@AuthUser() user: AuthorizedUser): Promise<ReportSummaryDto> {
    return this.reportService.getSummary(user.id);
  }
}
