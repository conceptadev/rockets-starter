import { WorkflowRawResults } from '../../domain/stargate-workflow.interface';

export const STARGATE_RUNTIME = Symbol('STARGATE_RUNTIME');

export interface WorkflowRuntimeError {
  readonly code?: string;
  readonly message: string;
  readonly nodeId?: string;
}

export interface WorkflowRuntimeState {
  readonly status: string;
  readonly results: WorkflowRawResults;
  readonly errors: readonly WorkflowRuntimeError[];
}

export interface WorkflowRuntimePort {
  execute(
    flow: string,
    inputs: Record<string, unknown>,
  ): Promise<WorkflowRuntimeState>;
}
