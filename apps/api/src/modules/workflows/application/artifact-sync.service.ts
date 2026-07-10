import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDynamicRepository, Where } from '@bitwild/rockets';
import type { RepositoryInterface } from '@bitwild/rockets';
import { ArtifactRecordEntity } from '../infrastructure/artifact-record.entity';
import { StargateExecutionService } from '../../stargate/application/stargate-execution.service';
import { ArtifactWorkspaceService } from './artifact-workspace.service';
import {
  AppSchema,
  deriveBusinessKey,
  getEntityKey,
  getRowsPath,
  getStoreMode,
  getVersion,
  readPath,
  validateRow,
} from './artifact-schema';
import { ARTIFACT_RECORD_ENTITY_KEY } from '../workflows.resource-key';

export interface SyncResult {
  app: string;
  mode: 'upsert' | 'append';
  written: number;
  skipped: number;
  errors: string[];
}

/**
 * Sync = the slow write path. Runs the micro-app's flow (which may fan out to
 * MCPs), takes the rows at `x-rows`, validates each against the schema, and
 * writes them into `artifact_record` (upsert by business key, or append for
 * history). Reads then hit the DB instantly via the records resource — the MCP
 * cost is paid once per sync, not per view.
 *
 * Synced rows are system-owned (`owner = null`); expose them with x-acl
 * read: "any" for shared dashboards. Uses the Rockets dynamic-repository
 * adapter (Where DSL, async create/update), not the raw TypeORM repository.
 */
@Injectable()
export class ArtifactSyncService {
  private readonly logger = new Logger(ArtifactSyncService.name);

  constructor(
    @InjectDynamicRepository(ARTIFACT_RECORD_ENTITY_KEY)
    private readonly repo: RepositoryInterface<ArtifactRecordEntity>,
    private readonly workspace: ArtifactWorkspaceService,
    private readonly stargate: StargateExecutionService,
  ) {}

  async sync(app: string): Promise<SyncResult> {
    const schema = this.requireSchema(app);
    const rowsPath = getRowsPath(schema);
    if (!rowsPath) {
      throw new BadRequestException(
        `App "${app}" has no x-rows path; nothing to sync.`,
      );
    }

    const state = await this.stargate.runRaw(app, {});
    if (state.status !== 'completed') {
      throw new BadRequestException(
        `Flow "${app}" ${state.status}: ${state.errors[0]?.message ?? 'no detail'}`,
      );
    }

    const rows = readPath(state.results, rowsPath);
    if (!Array.isArray(rows)) {
      throw new BadRequestException(
        `x-rows "${rowsPath}" did not resolve to an array.`,
      );
    }

    const mode = getStoreMode(schema);
    const entityKey = getEntityKey(schema, app);
    const version = getVersion(schema);
    const errors: string[] = [];
    let written = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        skipped++;
        errors.push(`row[${i}] is not an object`);
        continue;
      }
      const data = row as Record<string, unknown>;
      const rowErrors = validateRow(schema, data);
      if (rowErrors.length > 0) {
        skipped++;
        if (errors.length < 10) errors.push(`row[${i}]: ${rowErrors[0]}`);
        continue;
      }

      const businessKey = deriveBusinessKey(schema, data);

      if (mode === 'append') {
        await this.repo.create({
          app,
          entityKey,
          data,
          owner: null,
          businessKey,
          version,
          capturedAt: new Date(),
          dateDeleted: null,
        });
        written++;
        continue;
      }

      // upsert by business key
      const existing = await this.repo.findOne({
        where: Where.and(
          Where.eq('app', app),
          Where.eq('entityKey', entityKey),
          Where.eq('businessKey', businessKey),
          Where.isNull('dateDeleted'),
        ),
      });
      if (existing) {
        await this.repo.update(existing, {
          data,
          version,
          capturedAt: new Date(),
        });
      } else {
        await this.repo.create({
          app,
          entityKey,
          data,
          owner: null,
          businessKey,
          version,
          capturedAt: new Date(),
          dateDeleted: null,
        });
      }
      written++;
    }

    this.logger.log(
      `Synced "${app}" (${mode}): ${written} written, ${skipped} skipped`,
    );
    return { app, mode, written, skipped, errors };
  }

  private requireSchema(app: string): AppSchema {
    const schema = this.workspace.readSchema(app);
    if (!schema) {
      throw new BadRequestException(
        `"${app}" is not a micro-app (no schema installed).`,
      );
    }
    return schema;
  }
}
