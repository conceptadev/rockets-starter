import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccessControlGrant } from '@concepta/nestjs-access-control';
import { ActionEnum } from '@concepta/nestjs-core';
import { AuthUser } from '@bitwild/rockets';
import type { AuthorizedUser } from '@bitwild/rockets';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppUserRole } from '../../../../shared/domain/user-role.enum';
import {
  ArtifactRecordsService,
  RecordActor,
} from '../../application/artifact-records.service';
import { ArtifactSyncService } from '../../application/artifact-sync.service';
import {
  APPS_RECORD_RESOURCE,
  FLOWS_ARTIFACT_RESOURCE,
} from '../../workflows.resource-key';

/**
 * Generic micro-app records API. One controller serves every installed
 * micro-app: `:app` scopes the rows, the installed schema validates bodies,
 * and `x-acl` + the `owner` column decide visibility. No per-app code.
 */
@ApiBearerAuth()
@ApiTags('apps')
@Controller('apps/:app')
export class RecordsController {
  constructor(
    private readonly records: ArtifactRecordsService,
    private readonly sync: ArtifactSyncService,
  ) {}

  @Get('records')
  @AccessControlGrant({ resource: APPS_RECORD_RESOURCE, action: ActionEnum.READ })
  @ApiOkResponse({ description: 'List records for a micro-app.' })
  async list(
    @Param('app') app: string,
    @AuthUser() user: AuthorizedUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.records.list(app, this.actor(user), {
      limit: toInt(limit),
      offset: toInt(offset),
    });
  }

  @Get('records/:id')
  @AccessControlGrant({ resource: APPS_RECORD_RESOURCE, action: ActionEnum.READ })
  @ApiOkResponse({ description: 'Get one record.' })
  async get(
    @Param('app') app: string,
    @Param('id') id: string,
    @AuthUser() user: AuthorizedUser,
  ) {
    return this.records.get(app, id, this.actor(user));
  }

  @Post('records')
  @HttpCode(HttpStatus.CREATED)
  @AccessControlGrant({ resource: APPS_RECORD_RESOURCE, action: ActionEnum.CREATE })
  @ApiOkResponse({ description: 'Create a record.' })
  async create(
    @Param('app') app: string,
    @Body() body: unknown,
    @AuthUser() user: AuthorizedUser,
  ) {
    return this.records.create(app, body, this.actor(user));
  }

  @Patch('records/:id')
  @AccessControlGrant({ resource: APPS_RECORD_RESOURCE, action: ActionEnum.UPDATE })
  @ApiOkResponse({ description: 'Update a record.' })
  async update(
    @Param('app') app: string,
    @Param('id') id: string,
    @Body() body: unknown,
    @AuthUser() user: AuthorizedUser,
  ) {
    return this.records.update(app, id, body, this.actor(user));
  }

  @Delete('records/:id')
  @AccessControlGrant({ resource: APPS_RECORD_RESOURCE, action: ActionEnum.DELETE })
  @ApiOkResponse({ description: 'Soft-delete a record.' })
  async remove(
    @Param('app') app: string,
    @Param('id') id: string,
    @AuthUser() user: AuthorizedUser,
  ) {
    return this.records.remove(app, id, this.actor(user));
  }

  /** Privileged: run the flow and refresh the app's rows. ADMIN-only. */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @AccessControlGrant({ resource: FLOWS_ARTIFACT_RESOURCE, action: ActionEnum.CREATE })
  @ApiOkResponse({ description: 'Sync rows from the flow into the database.' })
  async syncApp(@Param('app') app: string) {
    return this.sync.sync(app);
  }

  private actor(user: AuthorizedUser): RecordActor {
    const isAdmin = (user.userRoles ?? []).some(
      (r) => r.role?.name === AppUserRole.ADMIN,
    );
    return { id: user.id, isAdmin };
  }
}

function toInt(value?: string): number | undefined {
  if (value === undefined) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}
