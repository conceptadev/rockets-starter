export type WorkflowInputs = Record<string, unknown>;
export type WorkflowRawResults = Record<string, Record<string, unknown>>;

export type WorkflowInputOf<TWorkflow> =
  TWorkflow extends StargateWorkflow<infer TInput, object, unknown>
    ? TInput
    : never;

export type WorkflowOutputOf<TWorkflow> =
  TWorkflow extends StargateWorkflow<unknown, object, infer TOutput>
    ? TOutput
    : never;

/**
 * Describes how a single Stargate flow maps to/from the API surface.
 * The flow file itself is installed under `.stargate/flows/<flow>.json`
 * (copied or bundled); this object owns the input/output mapping only.
 */
export interface StargateWorkflow<TInput, TResults extends object, TOutput> {
  readonly key: string;
  readonly flow: string;
  readonly description?: string;
  toInputs(dto: TInput): WorkflowInputs;
  parseResults(results: WorkflowRawResults): TResults;
  toOutput(results: TResults): TOutput;
}
