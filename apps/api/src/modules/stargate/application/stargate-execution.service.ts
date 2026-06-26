import { Inject, Injectable, Logger } from '@nestjs/common';
import { StargateWorkflow } from '../domain/stargate-workflow.interface';
import {
  WorkflowExecutionError,
  WorkflowOutputError,
  WorkflowUnavailableError,
} from '../domain/stargate-errors';
import {
  STARGATE_RUNTIME,
  WorkflowRuntimeError,
  WorkflowRuntimePort,
  WorkflowRuntimeState,
} from './ports/stargate-runtime.port';

@Injectable()
export class StargateExecutionService {
  private readonly logger = new Logger(StargateExecutionService.name);

  constructor(
    @Inject(STARGATE_RUNTIME)
    private readonly runtime: WorkflowRuntimePort,
  ) {}

  async run<TInput, TResults extends object, TOutput>(
    workflow: StargateWorkflow<TInput, TResults, TOutput>,
    dto: TInput,
  ): Promise<TOutput> {
    const { flow } = workflow;

    try {
      const state = await this.runtime.execute(flow, workflow.toInputs(dto));

      if (state.status !== 'completed') {
        throw this.executionError(flow, state);
      }

      return workflow.toOutput(workflow.parseResults(state.results));
    } catch (cause) {
      if (
        cause instanceof WorkflowExecutionError ||
        cause instanceof WorkflowOutputError ||
        cause instanceof WorkflowUnavailableError
      ) {
        throw cause;
      }

      this.log(`Workflow "${flow}" execution threw`, cause);
      throw new WorkflowExecutionError(
        flow,
        `Workflow "${flow}" failed to execute`,
        { cause },
      );
    }
  }

  private executionError(
    flow: string,
    state: WorkflowRuntimeState,
  ): WorkflowExecutionError {
    const error = state.errors[0];
    const detail = this.describe(state.status, error);

    this.logger.error(`Workflow "${flow}" ${state.status}: ${detail}`);

    return new WorkflowExecutionError(flow, detail, {
      code: error?.code,
      nodeId: error?.nodeId,
      status: state.status,
    });
  }

  private describe(status: string, error?: WorkflowRuntimeError): string {
    if (!error) {
      return `Workflow ${status}`;
    }

    return error.nodeId
      ? `${error.message} (node "${error.nodeId}")`
      : error.message;
  }

  private log(message: string, cause: unknown): void {
    this.logger.error(
      message,
      cause instanceof Error ? cause.stack : String(cause),
    );
  }
}
