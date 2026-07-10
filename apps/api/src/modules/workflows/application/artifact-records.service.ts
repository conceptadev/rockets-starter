import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDynamicRepository, Where } from '@bitwild/rockets';
import type { RepositoryInterface } from '@bitwild/rockets';
import { ArtifactRecordEntity } from '../infrastructure/artifact-record.entity';
import { ArtifactWorkspaceService } from './artifact-workspace.service';
import {
  AppSchema,
  deriveBusinessKey,
  getEntityKey,
  getReadAcl,
  getVersion,
  getWriteAcl,
  validateRow,
} from './artifact-schema';
import { ARTIFACT_RECORD_ENTITY_KEY } from '../workflows.resource-key';
import type { WhereClause } from '@concepta/nestjs-repository';

export interface RecordActor {
  readonly id: string;
  readonly isAdmin: boolean;
}

export interface ListOptions {
  readonly limit?: number;
  readonly offset?: number;
}

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

/**
 * Generic CRUD over the single `artifact_record` table, scoped per micro-app.
 * One static service serves every app: the app's installed schema drives
 * validation, the `x-acl` extension drives Own-vs-Any visibility, and the
 * `owner` column carries row ownership. No per-app code.
 *
 * Uses the Rockets dynamic-repository adapter (Where DSL, async create/update),
 * not the raw TypeORM repository.
 */
@Injectable()
export class ArtifactRecordsService {
  constructor(
    @InjectDynamicRepository(ARTIFACT_RECORD_ENTITY_KEY)
    private readonly repo: RepositoryInterface<ArtifactRecordEntity>,
    private readonly workspace: ArtifactWorkspaceService,
  ) {}

  async list(
    app: string,
    actor: RecordActor,
    options: ListOptions = {},
  ): Promise<{ items: ArtifactRecordEntity[]; total: number }> {
    const schema = this.requireSchema(app);
    const take = clamp(options.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);
    const skip = Math.max(0, options.offset ?? 0);

    const [items, total] = await this.repo.findAndCount({
      where: this.scopeWhere(app, schema, actor, 'read'),
      order: [{ field: 'capturedAt', order: 'DESC' }],
      take,
      skip,
    });
    return { items, total };
  }

  async get(
    app: string,
    id: string,
    actor: RecordActor,
  ): Promise<ArtifactRecordEntity> {
    const schema = this.requireSchema(app);
    const record = await this.findInApp(app, id);
    this.assertCanRead(schema, actor, record);
    return record;
  }

  async create(
    app: string,
    body: unknown,
    actor: RecordActor,
  ): Promise<ArtifactRecordEntity> {
    const schema = this.requireSchema(app);
    const data = this.validateBody(schema, body);
    return this.repo.create({
      app,
      entityKey: getEntityKey(schema, app),
      data,
      owner: actor.id,
      businessKey: deriveBusinessKey(schema, data),
      version: getVersion(schema),
      capturedAt: new Date(),
      dateDeleted: null,
    });
  }

  async update(
    app: string,
    id: string,
    body: unknown,
    actor: RecordActor,
  ): Promise<ArtifactRecordEntity> {
    const schema = this.requireSchema(app);
    const record = await this.findInApp(app, id);
    this.assertCanWrite(schema, actor, record);
    const data = this.validateBody(schema, body);
    return this.repo.update(record, {
      data,
      businessKey: deriveBusinessKey(schema, data),
      version: getVersion(schema),
    });
  }

  async remove(
    app: string,
    id: string,
    actor: RecordActor,
  ): Promise<{ id: string; removed: true }> {
    const schema = this.requireSchema(app);
    const record = await this.findInApp(app, id);
    this.assertCanWrite(schema, actor, record);
    // Manual soft delete: `dateDeleted` is a plain column (not a TypeORM
    // @DeleteDateColumn), so we stamp it and filter on it everywhere.
    await this.repo.update(record, { dateDeleted: new Date() });
    return { id, removed: true };
  }

  // ── internals ──────────────────────────────────────────────────────────────

  private requireSchema(app: string): AppSchema {
    const schema = this.workspace.readSchema(app);
    if (!schema) {
      throw new NotFoundException(
        `"${app}" is not a micro-app (no schema installed).`,
      );
    }
    return schema;
  }

  private validateBody(
    schema: AppSchema,
    body: unknown,
  ): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new BadRequestException('Request body must be an object.');
    }
    const errors = validateRow(schema, body);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.join('; ')}`);
    }
    return body as Record<string, unknown>;
  }

  private async findInApp(
    app: string,
    id: string,
  ): Promise<ArtifactRecordEntity> {
    const record = await this.repo.findOne({
      where: Where.and(
        Where.eq('id', id),
        Where.eq('app', app),
        Where.isNull('dateDeleted'),
      ),
    });
    if (!record) {
      throw new NotFoundException(`Record "${id}" not found in app "${app}".`);
    }
    return record;
  }

  private scopeWhere(
    app: string,
    schema: AppSchema,
    actor: RecordActor,
    mode: 'read' | 'write',
  ): WhereClause {
    const acl = mode === 'read' ? getReadAcl(schema) : getWriteAcl(schema);
    const conditions: WhereClause[] = [
      Where.eq('app', app),
      Where.isNull('dateDeleted'),
    ];
    if (!(actor.isAdmin || acl === 'any')) {
      conditions.push(Where.eq('owner', actor.id));
    }
    return Where.and(...conditions);
  }

  private assertCanRead(
    schema: AppSchema,
    actor: RecordActor,
    record: ArtifactRecordEntity,
  ): void {
    if (actor.isAdmin || getReadAcl(schema) === 'any') return;
    if (record.owner !== actor.id) {
      throw new ForbiddenException('You can only read your own records.');
    }
  }

  private assertCanWrite(
    schema: AppSchema,
    actor: RecordActor,
    record: ArtifactRecordEntity,
  ): void {
    if (actor.isAdmin || getWriteAcl(schema) === 'any') return;
    if (record.owner !== actor.id) {
      throw new ForbiddenException('You can only modify your own records.');
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
