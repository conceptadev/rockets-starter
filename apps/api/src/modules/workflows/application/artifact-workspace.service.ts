import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface McpServerEntry {
  name: string;
  url: string;
  token?: string;
}
import {
  ARTIFACT_NAME_PATTERN,
  ArtifactSummary,
  PublishArtifactInput,
} from './artifact-workspace.types';

@Injectable()
export class ArtifactWorkspaceService {
  list(): ArtifactSummary[] {
    const dir = this.uiDirectory();
    if (!existsSync(dir)) return [];

    return readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => this.summaryFor(file.replace(/\.json$/, '')))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  readUi(name: string): unknown {
    this.assertName(name);
    const path = this.uiPath(name);
    if (!existsSync(path)) {
      throw new NotFoundException(`No ui-schema for flow "${name}"`);
    }
    return JSON.parse(readFileSync(path, 'utf8')) as unknown;
  }

  publish(input: PublishArtifactInput): ArtifactSummary {
    this.assertName(input.name);
    const flow = this.normalizeDocument(input.flow, 'flow');
    const ui = this.normalizeDocument(input.ui, 'ui');
    this.assertFlowId(input.name, flow);

    const flowPath = this.flowPath(input.name);
    const uiPath = this.uiPath(input.name);

    if (!input.overwrite && (existsSync(flowPath) || existsSync(uiPath))) {
      throw new ConflictException(
        `Artifact "${input.name}" already exists. Set overwrite=true to replace it.`,
      );
    }

    mkdirSync(this.flowDirectory(), { recursive: true });
    mkdirSync(this.uiDirectory(), { recursive: true });
    this.writeJson(flowPath, flow);
    this.writeJson(uiPath, ui);

    return this.summaryFor(input.name);
  }

  listMcpServers(): Record<string, unknown> {
    const config = this.readMcpConfig();
    return config.servers ?? {};
  }

  registerMcpServer(entry: McpServerEntry): void {
    const config = this.readMcpConfig();
    const transport: Record<string, unknown> = { type: 'http', url: entry.url };
    if (entry.token) {
      transport['headers'] = { Authorization: `Bearer ${entry.token}` };
    }
    config.servers = { ...(config.servers ?? {}), [entry.name]: { transport } };
    const path = join(this.stargateDir(), 'mcp.json');
    mkdirSync(this.stargateDir(), { recursive: true });
    writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  }

  private readMcpConfig(): { servers?: Record<string, unknown> } {
    const path = join(this.stargateDir(), 'mcp.json');
    if (!existsSync(path)) return { servers: {} };
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as { servers?: Record<string, unknown> };
    } catch {
      return { servers: {} };
    }
  }

  private stargateDir(): string {
    return join(this.workspaceRoot(), '.stargate');
  }

  /** Removes an installed artifact (flow + ui-schema). Idempotent per file. */
  remove(name: string): { name: string; removed: boolean } {
    this.assertName(name);
    const flowPath = this.flowPath(name);
    const uiPath = this.uiPath(name);
    const existed = existsSync(flowPath) || existsSync(uiPath);
    if (!existed) {
      throw new NotFoundException(`Artifact "${name}" is not installed.`);
    }
    rmSync(flowPath, { force: true });
    rmSync(uiPath, { force: true });
    return { name, removed: true };
  }

  private normalizeDocument(
    value: Record<string, unknown>,
    label: string,
  ): Record<string, unknown> {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      throw new BadRequestException(`${label} must be a JSON object.`);
    }
    return { ...value };
  }

  private assertFlowId(name: string, flow: Record<string, unknown>): void {
    if (flow.id === undefined) {
      flow.id = name;
      return;
    }
    if (flow.id !== name) {
      throw new BadRequestException('flow.id must match name.');
    }
  }

  private summaryFor(name: string): ArtifactSummary {
    this.assertName(name);
    const path = this.uiPath(name);
    let title = name;
    let subtitle = '';

    try {
      const ui = JSON.parse(readFileSync(path, 'utf8')) as {
        title?: string;
        subtitle?: string;
      };
      title = ui.title ?? name;
      subtitle = ui.subtitle ?? '';
    } catch {
      // Keep malformed schemas visible in the catalog so they can be replaced.
    }

    return {
      name,
      title,
      subtitle,
      updatedAt: existsSync(path) ? statSync(path).mtimeMs : 0,
    };
  }

  private assertName(name: string): void {
    if (!ARTIFACT_NAME_PATTERN.test(name)) {
      throw new BadRequestException('Invalid flow name.');
    }
  }

  private writeJson(path: string, value: Record<string, unknown>): void {
    writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  }

  private flowPath(name: string): string {
    return join(this.flowDirectory(), `${name}.json`);
  }

  private uiPath(name: string): string {
    return join(this.uiDirectory(), `${name}.json`);
  }

  private flowDirectory(): string {
    return join(this.workspaceRoot(), '.stargate', 'flows');
  }

  private uiDirectory(): string {
    return join(this.workspaceRoot(), '.stargate', 'ui');
  }

  private workspaceRoot(): string {
    if (process.env.STARGATE_WORKSPACE_ROOT) {
      return resolve(process.env.STARGATE_WORKSPACE_ROOT);
    }

    let dir = process.cwd();
    for (;;) {
      if (existsSync(join(dir, '.stargate'))) return dir;
      const parent = dirname(dir);
      if (parent === dir) return process.cwd();
      dir = parent;
    }
  }
}
