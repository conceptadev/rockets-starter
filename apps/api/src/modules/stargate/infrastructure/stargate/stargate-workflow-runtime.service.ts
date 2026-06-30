import { Inject, Injectable, Logger } from '@nestjs/common';
import { Registry, Workflow } from '@stargate/core';
import { WorkflowEngine, type WorkflowExecutionState } from '@stargate/engine';
import { builtins } from '@stargate/components';
import type { McpServerManager } from '@stargate/server';
import {
  FlowService,
  MCP_SERVER_MANAGER,
  WorkspaceMcpServersService,
  WorkspaceService,
} from '@stargate/server/nest';
import {
  WorkflowRuntimePort,
  WorkflowRuntimeState,
} from '../../application/ports/stargate-runtime.port';
import { WorkflowUnavailableError } from '../../domain/stargate-errors';

// reload-bump: mcp.call + flow.merge + mcp.mapCall now present in @stargate/components build
/** Only string env vars are valid Stargate execution environment values. */
function stringEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

@Injectable()
export class StargateWorkflowRuntimeService implements WorkflowRuntimePort {
  private readonly logger = new Logger(StargateWorkflowRuntimeService.name);

  constructor(
    @Inject(FlowService)
    private readonly flows: FlowService,
    @Inject(WorkspaceMcpServersService)
    private readonly mcpServers: WorkspaceMcpServersService,
    @Inject(WorkspaceService)
    private readonly workspace: WorkspaceService,
    @Inject(MCP_SERVER_MANAGER)
    private readonly mcpManager: McpServerManager,
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
      const spec = await this.flows.read(flow);
      // Generic runtime: only Stargate built-ins — no report-specific host
      // components. Installed artifacts are pure flow.json + ui.json and may
      // only reference components Stargate ships. Then layer in the workspace's
      // MCP server presets from `.stargate/mcp.json` so `mcp.call` can resolve
      // them (MCP is just one kind of node; http/template/transform/etc. work
      // the same way). Absent mcp.json this is a no-op.
      const base = new Registry([...builtins]);
      const registry = await this.mcpServers.registryWithFreshMcpServers(base);
      return new WorkflowEngine({
        workflow: new Workflow({ registry, spec }),
        environment: stringEnv(),
        services: {
          fs: this.workspace.workspace.fs,
          mcpManager: this.mcpManager,
        },
      });
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
