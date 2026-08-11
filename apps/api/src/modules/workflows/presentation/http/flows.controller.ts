import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthPublic } from '@concepta/rockets';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StargateExecutionService } from '../../../stargate/application/stargate-execution.service';
import { ArtifactWorkspaceService } from '../../application/artifact-workspace.service';
import { ArtifactSummary } from '../../application/artifact-workspace.types';
import { PublishArtifactDto } from './dto/publish-artifact.dto';

interface RunFlowDto {
  readonly inputs?: Record<string, unknown>;
}

/**
 * Generic drop-in runner + catalog. Any flow placed in
 * `.stargate/flows/<name>.json` with a `.stargate/ui/<name>.json` becomes:
 *   - listed at `GET /flows`
 *   - runnable at `POST /flows/<name>/run`
 *   - rendered at `GET /flows/<name>/ui`
 * No per-flow code — this is what lets Cowork ship an artifact as plain JSON.
 */
@ApiBearerAuth()
@ApiTags('flows')
@Controller('flows')
export class FlowsController {
  constructor(
    private readonly stargate: StargateExecutionService,
    private readonly artifacts: ArtifactWorkspaceService,
  ) {}

  /** Lists installed artifacts (flows that have a ui-schema), newest first. */
  @Get()
  @AuthPublic()
  @ApiOkResponse({ description: 'Installed artifacts.' })
  list(): ArtifactSummary[] {
    return this.artifacts.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Published artifact summary.' })
  publish(@Body() body: PublishArtifactDto): ArtifactSummary {
    return this.artifacts.publish(body);
  }

  @Post(':name/run')
  @AuthPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Raw workflow execution state.' })
  async run(@Param('name') name: string, @Body() body: RunFlowDto) {
    const state = await this.stargate.runRaw(name, body?.inputs ?? {});
    if (state.status !== 'completed') {
      throw new BadGatewayException(
        `Flow "${name}" ${state.status}: ${state.errors[0]?.message ?? 'no detail'}`,
      );
    }
    return state;
  }

  @Get(':name/ui')
  @AuthPublic()
  @ApiOkResponse({ description: 'UI schema for the flow.' })
  ui(@Param('name') name: string) {
    return this.artifacts.readUi(name);
  }
}
