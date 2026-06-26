import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  type WorkflowEngine,
  type WorkflowExecutionState,
} from '@stargate/engine';
import { FlowService, WorkflowRunnerService } from '@stargate/server/nest';
import {
  WorkflowRuntimePort,
  WorkflowRuntimeState,
} from '../../application/ports/stargate-runtime.port';
import { WorkflowUnavailableError } from '../../domain/stargate-errors';

@Injectable()
export class StargateWorkflowRuntimeService implements WorkflowRuntimePort {
  private readonly logger = new Logger(StargateWorkflowRuntimeService.name);

  constructor(
    @Inject(WorkflowRunnerService)
    private readonly workflowRunner: WorkflowRunnerService,
    @Inject(FlowService)
    private readonly flows: FlowService,
  ) {}

  async execute(
    flow: string,
    inputs: Record<string, unknown>,
  ): Promise<WorkflowRuntimeState> {
    const engine = await this.startEngine(flow);

    try {
      return this.toRuntimeState(await engine.execute(inputs));
    } finally {
      await this.dispose(flow, engine);
    }
  }

  private async startEngine(flow: string): Promise<WorkflowEngine> {
    try {
      const { spec } = await this.flows.read(flow);
      return await this.workflowRunner.create(spec);
    } catch (cause) {
      this.log(`Failed to start workflow "${flow}"`, cause);
      throw new WorkflowUnavailableError(flow, { cause });
    }
  }

  private toRuntimeState(state: WorkflowExecutionState): WorkflowRuntimeState {
    return {
      status: state.status,
      results: state.results,
      errors: state.errors,
    };
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
