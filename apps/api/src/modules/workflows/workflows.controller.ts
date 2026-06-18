import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { aiSummaryWorkflow } from './flows/ai-summary.workflow';
import { SummarizeResponseDto } from './summarize-response.dto';
import { SummarizeWorkflowDto } from './summarize-workflow.dto';
import { WorkflowsService } from './workflows.service';

@ApiBearerAuth()
@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflows: WorkflowsService) {}

  @Post('ai-summary/summarize')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SummarizeResponseDto })
  summarize(@Body() dto: SummarizeWorkflowDto): Promise<SummarizeResponseDto> {
    return this.workflows.run(aiSummaryWorkflow, dto);
  }
}
