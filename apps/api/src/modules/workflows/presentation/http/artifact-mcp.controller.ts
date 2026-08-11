import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthPublic } from '@concepta/rockets';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { ArtifactWorkspaceService } from '../../application/artifact-workspace.service';

type ReqWithBody = IncomingMessage & { body?: unknown };

/**
 * MCP endpoint (Streamable HTTP, stateless JSON) that lets a remote client —
 * e.g. Claude/Cowork — push finished artifacts into THIS running instance with
 * no redeploy. Same target as `POST /flows`, but spoken over MCP so an agent
 * can install/list/remove artifacts as tools against any published Rockets.
 *
 * Tools: install_artifact, list_artifacts, remove_artifact.
 * Auth: bearer token in `Authorization`, compared to `ARTIFACT_MCP_TOKEN`.
 *       The endpoint is public to the app's global auth guard and does its own
 *       token check, so it works without an interactive Microsoft login.
 */
@ApiExcludeController()
@AuthPublic()
@Controller('mcp')
export class ArtifactMcpController {
  constructor(private readonly artifacts: ArtifactWorkspaceService) {}

  @Post()
  async handle(
    @Req() req: ReqWithBody,
    @Res() res: ServerResponse,
  ): Promise<void> {
    if (!this.authorize(req, res)) return;

    const server = this.buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on('close', () => {
      void transport.close();
      void server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }

  /** Bearer-token gate. If ARTIFACT_MCP_TOKEN is unset, auth is disabled. */
  private authorize(req: ReqWithBody, res: ServerResponse): boolean {
    const expected = process.env.ARTIFACT_MCP_TOKEN;
    if (!expected) return true; // no token configured → open
    const header = req.headers['authorization'];
    const token = Array.isArray(header) ? header[0] : header;
    const presented = token?.replace(/^Bearer\s+/i, '').trim();
    if (!presented || presented !== expected) {
      this.deny(res, 401, 'Invalid or missing bearer token.');
      return false;
    }
    return true;
  }

  private deny(res: ServerResponse, status: number, message: string): void {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32001, message },
        id: null,
      }),
    );
  }

  private buildServer(): McpServer {
    const server = new McpServer({
      name: 'rockets-artifacts',
      version: '1.0.0',
    });

    server.registerTool(
      'install_artifact',
      {
        title: 'Install artifact',
        description:
          'Install (or overwrite) an artifact into this instance. Writes the ' +
          'Stargate flow and its UI schema so it appears at GET /flows and ' +
          'renders at /report/<name>. flow.id must equal name (auto-set if absent).',
        inputSchema: {
          name: z
            .string()
            .describe(
              'Artifact id (letters, numbers, _ or -). Used as filename and flow.id.',
            ),
          flow: z
            .record(z.string(), z.unknown())
            .describe(
              'Stargate flow spec JSON object ({ id, name, nodes, connections }).',
            ),
          ui: z
            .record(z.string(), z.unknown())
            .describe(
              'UI-schema JSON object ({ title, subtitle, data, blocks, ... }).',
            ),
          overwrite: z
            .boolean()
            .optional()
            .describe(
              'Replace an existing artifact with the same name. Default false.',
            ),
        },
      },
      async (args) => {
        try {
          const summary = this.artifacts.publish({
            name: args.name,
            flow: args.flow as Record<string, unknown>,
            ui: args.ui as Record<string, unknown>,
            overwrite: args.overwrite,
          });
          return this.ok(
            `Installed "${summary.name}" — ${summary.title}`,
            summary,
          );
        } catch (error) {
          return this.fail(error);
        }
      },
    );

    server.registerTool(
      'list_artifacts',
      {
        title: 'List artifacts',
        description:
          'List installed artifacts (name, title, subtitle, updatedAt), newest first.',
        inputSchema: {},
      },
      async () => {
        try {
          const items = this.artifacts.list();
          const lines = items.length
            ? items.map((a) => `- ${a.name}: ${a.title}`).join('\n')
            : '(none installed)';
          return this.ok(`${items.length} artifact(s):\n${lines}`, items);
        } catch (error) {
          return this.fail(error);
        }
      },
    );

    server.registerTool(
      'remove_artifact',
      {
        title: 'Remove artifact',
        description:
          'Remove an installed artifact (its flow and UI schema) by name.',
        inputSchema: {
          name: z.string().describe('Artifact id to remove.'),
        },
      },
      async (args) => {
        try {
          const result = this.artifacts.remove(args.name);
          return this.ok(`Removed "${result.name}"`, result);
        } catch (error) {
          return this.fail(error);
        }
      },
    );

    return server;
  }

  private ok(text: string, data: unknown) {
    return {
      content: [
        { type: 'text' as const, text },
        { type: 'text' as const, text: JSON.stringify(data) },
      ],
    };
  }

  private fail(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isError: true,
      content: [{ type: 'text' as const, text: `Error: ${message}` }],
    };
  }
}
