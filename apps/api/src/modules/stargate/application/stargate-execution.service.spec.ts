import { Logger } from '@nestjs/common';
import { StargateWorkflow } from '../domain/stargate-workflow.interface';
import {
  WorkflowExecutionError,
  WorkflowOutputError,
  WorkflowUnavailableError,
} from '../domain/stargate-errors';
import {
  WorkflowRuntimePort,
  WorkflowRuntimeState,
} from './ports/stargate-runtime.port';
import { StargateExecutionService } from './stargate-execution.service';

interface TestInput {
  value: string;
}

interface TestOutput {
  echoed: string;
}

interface TestWorkflowResults {
  readonly node: {
    readonly out: string;
  };
}

const workflow: StargateWorkflow<TestInput, TestWorkflowResults, TestOutput> = {
  key: 'test',
  flow: 'test-flow',
  toInputs: (dto) => ({ in: dto.value }),
  parseResults: (results) => {
    const out = results.node?.out;

    if (typeof out !== 'string') {
      throw new WorkflowOutputError('bad shape');
    }

    return { node: { out } };
  },
  toOutput: (results) => ({ echoed: results.node.out }),
};

function completedState(
  overrides: Partial<WorkflowRuntimeState> = {},
): WorkflowRuntimeState {
  return {
    status: 'completed',
    results: { node: { out: 'ok' } },
    errors: [],
    ...overrides,
  };
}

describe('StargateExecutionService', () => {
  let execute: jest.MockedFunction<WorkflowRuntimePort['execute']>;
  let service: StargateExecutionService;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    execute = jest.fn<
      ReturnType<WorkflowRuntimePort['execute']>,
      Parameters<WorkflowRuntimePort['execute']>
    >();
    execute.mockResolvedValue(completedState());

    service = new StargateExecutionService({ execute });
  });

  afterEach(() => jest.restoreAllMocks());

  const run = (flow = workflow) => service.run(flow, { value: 'hi' });

  it('loads the flow, executes mapped inputs, and maps the output', async () => {
    await expect(run()).resolves.toEqual({ echoed: 'ok' });

    expect(execute).toHaveBeenCalledWith('test-flow', { in: 'hi' });
  });

  it('throws unavailable when the runtime cannot start the flow', async () => {
    execute.mockRejectedValue(new WorkflowUnavailableError('test-flow'));

    await expect(run()).rejects.toBeInstanceOf(WorkflowUnavailableError);
  });

  it('throws execution error with node attribution when the workflow does not complete', async () => {
    execute.mockResolvedValue(
      completedState({
        status: 'failed',
        errors: [
          { code: 'workflow_failed', message: 'boom', nodeId: 'summarize' },
        ],
      }),
    );

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WorkflowExecutionError);
    expect((error as Error).message).toContain('boom');
    expect((error as Error).message).toContain('summarize');
  });

  it('preserves timeout execution codes', async () => {
    execute.mockResolvedValue(
      completedState({
        status: 'failed',
        errors: [{ code: 'handler_timeout', message: 'too slow' }],
      }),
    );

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WorkflowExecutionError);
    expect((error as WorkflowExecutionError).code).toBe('handler_timeout');
  });

  it('falls back to a generic message when a non-completed state has no errors', async () => {
    execute.mockResolvedValue(
      completedState({ status: 'canceled', errors: [] }),
    );

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WorkflowExecutionError);
    expect((error as Error).message).toContain('canceled');
  });

  it('wraps a raw runtime throw', async () => {
    execute.mockRejectedValue(new Error('kaboom'));

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WorkflowExecutionError);
    expect((error as Error).message).toContain('failed to execute');
  });

  it('propagates a workflow output error from toOutput without re-wrapping', async () => {
    const failing: StargateWorkflow<
      TestInput,
      TestWorkflowResults,
      TestOutput
    > = {
      ...workflow,
      parseResults: () => {
        throw new WorkflowOutputError('bad shape');
      },
    };

    const error = await run(failing).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WorkflowOutputError);
    expect((error as Error).message).toBe('bad shape');
  });
});
