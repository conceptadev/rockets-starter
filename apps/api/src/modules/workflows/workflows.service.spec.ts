import {
  BadGatewayException,
  GatewayTimeoutException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { WorkflowDefinition } from './workflow-definition.interface';
import { WorkflowsService } from './workflows.service';

interface TestInput {
  value: string;
}

interface TestOutput {
  echoed: string;
}

const definition: WorkflowDefinition<TestInput, TestOutput> = {
  flow: 'test-flow',
  toInputs: (dto) => ({ in: dto.value }),
  toOutput: (results) => ({ echoed: results.node.out as string }),
};

function completedState(overrides: Record<string, unknown> = {}) {
  return {
    status: 'completed',
    results: { node: { out: 'ok' } },
    errors: [],
    ...overrides,
  };
}

describe('WorkflowsService', () => {
  let execute: jest.Mock;
  let dispose: jest.Mock;
  let create: jest.Mock;
  let read: jest.Mock;
  let service: WorkflowsService;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    execute = jest.fn().mockResolvedValue(completedState());
    dispose = jest.fn().mockResolvedValue(undefined);
    create = jest.fn().mockResolvedValue({ execute, dispose });
    read = jest.fn().mockResolvedValue({ spec: { id: 'spec' }, mtime: 0 });

    service = new WorkflowsService({ create } as never, { read } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  const run = (def = definition) => service.run(def, { value: 'hi' });

  it('loads the flow, executes mapped inputs, and maps the output', async () => {
    await expect(run()).resolves.toEqual({ echoed: 'ok' });

    expect(read).toHaveBeenCalledWith('test-flow');
    expect(create).toHaveBeenCalledWith({ id: 'spec' });
    expect(execute).toHaveBeenCalledWith({ in: 'hi' });
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('throws 500 and never creates an engine when the flow fails to load', async () => {
    read.mockRejectedValue(new Error('missing flow file'));

    await expect(run()).rejects.toBeInstanceOf(InternalServerErrorException);
    expect(create).not.toHaveBeenCalled();
    expect(dispose).not.toHaveBeenCalled();
  });

  it('throws 500 when the engine cannot be created', async () => {
    create.mockRejectedValue(new Error('mcp wiring failed'));

    await expect(run()).rejects.toBeInstanceOf(InternalServerErrorException);
    expect(dispose).not.toHaveBeenCalled();
  });

  it('throws 502 with node attribution when the workflow does not complete', async () => {
    execute.mockResolvedValue(
      completedState({
        status: 'failed',
        errors: [
          { code: 'workflow_failed', message: 'boom', nodeId: 'summarize' },
        ],
      }),
    );

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as Error).message).toContain('boom');
    expect((error as Error).message).toContain('summarize');
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('throws 504 when a node times out', async () => {
    execute.mockResolvedValue(
      completedState({
        status: 'failed',
        errors: [{ code: 'handler_timeout', message: 'too slow' }],
      }),
    );

    await expect(run()).rejects.toBeInstanceOf(GatewayTimeoutException);
  });

  it('falls back to a generic message when a non-completed state has no errors', async () => {
    execute.mockResolvedValue(
      completedState({ status: 'canceled', errors: [] }),
    );

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as Error).message).toContain('canceled');
  });

  it('wraps a raw execution throw as 502 and still disposes', async () => {
    execute.mockRejectedValue(new Error('kaboom'));

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as Error).message).toContain('failed to execute');
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('propagates an HttpException from toOutput without re-wrapping', async () => {
    const failing: WorkflowDefinition<TestInput, TestOutput> = {
      ...definition,
      toOutput: () => {
        throw new BadGatewayException('bad shape');
      },
    };

    const error = await run(failing).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadGatewayException);
    expect((error as Error).message).toBe('bad shape');
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('swallows a dispose failure and still returns the output', async () => {
    dispose.mockRejectedValue(new Error('cleanup failed'));

    await expect(run()).resolves.toEqual({ echoed: 'ok' });
  });
});
