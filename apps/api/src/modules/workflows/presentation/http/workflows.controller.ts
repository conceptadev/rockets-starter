import {
  BadGatewayException,
  Body,
  Controller,
  GatewayTimeoutException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StargateExecutionService } from '../../../stargate/application/stargate-execution.service';
import { aiSummaryWorkflow } from '../../application/flows/ai-summary.workflow';
import { SummarizeResponseDto } from './dto/summarize-response.dto';
import { SummarizeWorkflowDto } from './dto/summarize-workflow.dto';
import {
  WorkflowExecutionError,
  WorkflowNotRegisteredError,
  WorkflowOutputError,
  WorkflowUnavailableError,
} from '../../../stargate/domain/stargate-errors';

@ApiBearerAuth()
@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly stargate: StargateExecutionService) {}

  @Post('ai-summary/summarize')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SummarizeResponseDto })
  async summarize(
    @Body() dto: SummarizeWorkflowDto,
  ): Promise<SummarizeResponseDto> {
    try {
      return await this.stargate.run(aiSummaryWorkflow, dto);
    } catch (error) {
      throw this.toHttpError(error);
    }
  }

  private toHttpError(error: unknown): Error {
    if (error instanceof WorkflowNotRegisteredError) {
      return new NotFoundException(error.message);
    }

    if (error instanceof WorkflowUnavailableError) {
      return new InternalServerErrorException(error.message);
    }

    if (error instanceof WorkflowExecutionError) {
      return error.code === 'handler_timeout'
        ? new GatewayTimeoutException(error.message)
        : new BadGatewayException(error.message);
    }

    if (error instanceof WorkflowOutputError) {
      return new BadGatewayException(error.message);
    }

    return new BadGatewayException(
      error instanceof Error ? error.message : 'Workflow failed to execute',
    );
  }
}
