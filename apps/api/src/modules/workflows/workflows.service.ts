import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ExecutionStatus,
  type ExecutionErrorInfo,
  type WorkflowEngine,
  type WorkflowExecutionState,
} from '@stargate/engine';
import { FlowService, WorkflowRunnerService } from '@stargate/server/nest';
import { WorkflowDefinition } from './workflow-definition.interface';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(
    private readonly workflowRunner: WorkflowRunnerService,
    private readonly flows: FlowService,
  ) {}

  async run<TInput, TOutput>(
    definition: WorkflowDefinition<TInput, TOutput>,
    dto: TInput,
  ): Promise<TOutput> {
    const { flow } = definition;
    const engine = await this.start(flow);

    try {
      const state = await engine.execute(definition.toInputs(dto));

      if (state.status !== ExecutionStatus.Completed) {
        throw this.executionError(flow, state);
      }

      return definition.toOutput(state.results);
    } catch (cause) {
      if (cause instanceof HttpException) {
        throw cause;
      }

      this.log(`Workflow "${flow}" execution threw`, cause);
      throw new BadGatewayException(`Workflow "${flow}" failed to execute`);
    } finally {
      await this.dispose(flow, engine);
    }
  }

  private async start(flow: string): Promise<WorkflowEngine> {
    try {
      const { spec } = await this.flows.read(flow);
      return await this.workflowRunner.create(spec);
    } catch (cause) {
      this.log(`Failed to start workflow "${flow}"`, cause);
      throw new InternalServerErrorException(
        `Workflow "${flow}" is unavailable`,
      );
    }
  }

  private executionError(
    flow: string,
    state: WorkflowExecutionState,
  ): HttpException {
    const error = state.errors[0];
    const detail = this.describe(state.status, error);

    this.logger.error(`Workflow "${flow}" ${state.status}: ${detail}`);

    return error?.code === 'handler_timeout'
      ? new GatewayTimeoutException(detail)
      : new BadGatewayException(detail);
  }

  private describe(
    status: ExecutionStatus,
    error?: ExecutionErrorInfo,
  ): string {
    if (!error) {
      return `Stargate workflow ${status}`;
    }

    return error.nodeId
      ? `${error.message} (node "${error.nodeId}")`
      : error.message;
  }

  private async dispose(flow: string, engine: WorkflowEngine): Promise<void> {
    try {
      await engine.dispose();
    } catch (cause) {
      this.log(`Failed to dispose workflow "${flow}"`, cause);
    }
  }

  private log(message: string, cause: unknown): void {
    this.logger.error(
      message,
      cause instanceof Error ? cause.stack : String(cause),
    );
  }
}
