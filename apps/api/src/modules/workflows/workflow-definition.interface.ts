import type { WorkflowExecutionState } from '@stargate/engine';

export type WorkflowResults = WorkflowExecutionState['results'];

/**
 * Describes how a single Stargate flow maps to/from the API surface.
 * The flow file itself is installed under `.stargate/flows/<flow>.json`
 * (copied or bundled); this object owns the input/output mapping only.
 */
export interface WorkflowDefinition<TInput, TOutput> {
  readonly flow: string;
  toInputs(dto: TInput): Record<string, unknown>;
  toOutput(results: WorkflowResults): TOutput;
}
