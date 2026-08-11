import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { StargateModule } from '../src/modules/stargate/stargate.module';
import { ArtifactWorkspaceService } from '../src/modules/workflows/application/artifact-workspace.service';
import { aiSummaryWorkflow } from '../src/modules/workflows/application/flows/ai-summary.workflow';
import { FlowsController } from '../src/modules/workflows/presentation/http/flows.controller';
import { WorkflowsController } from '../src/modules/workflows/presentation/http/workflows.controller';

/**
 * E2E slice without ArtifactMcpController — MCP SDK leaves open handles under Jest.
 */
@Module({
  imports: [
    StargateModule.register({
      workflows: [aiSummaryWorkflow],
    }),
  ],
  controllers: [WorkflowsController, FlowsController],
  providers: [ArtifactWorkspaceService],
})
class WorkflowsHttpE2eModule {}

describe('Workflows (e2e)', () => {
  let app: INestApplication;
  let previousWorkspaceRoot: string | undefined;
  let workspaceRoot: string;

  beforeAll(async () => {
    previousWorkspaceRoot = process.env.STARGATE_WORKSPACE_ROOT;
    workspaceRoot = mkdtempSync(join(tmpdir(), 'rockets-stargate-'));
    process.env.STARGATE_WORKSPACE_ROOT = workspaceRoot;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WorkflowsHttpE2eModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (previousWorkspaceRoot === undefined) {
      delete process.env.STARGATE_WORKSPACE_ROOT;
    } else {
      process.env.STARGATE_WORKSPACE_ROOT = previousWorkspaceRoot;
    }
    rmSync(workspaceRoot, { recursive: true, force: true });
  });

  it('POST /workflows/ai-summary/summarize returns the mapped summary', async () => {
    await request(app.getHttpServer())
      .post('/workflows/ai-summary/summarize')
      .send({ text: 'something worth summarizing' })
      .expect(200)
      .expect({ summary: 'test summary' });
  });

  it('rejects an empty text with 400', async () => {
    await request(app.getHttpServer())
      .post('/workflows/ai-summary/summarize')
      .send({ text: '' })
      .expect(400);
  });

  it('rejects a missing text with 400', async () => {
    await request(app.getHttpServer())
      .post('/workflows/ai-summary/summarize')
      .send({})
      .expect(400);
  });

  it('rejects unknown properties with 400', async () => {
    await request(app.getHttpServer())
      .post('/workflows/ai-summary/summarize')
      .send({ text: 'valid', injected: true })
      .expect(400);
  });

  it('POST /flows publishes a flow and ui schema into the Stargate workspace', async () => {
    await request(app.getHttpServer())
      .post('/flows')
      .send({
        name: 'ops-report',
        flow: {
          nodes: [],
        },
        ui: {
          title: 'Operations Report',
          subtitle: 'Published from API',
        },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({
          name: 'ops-report',
          title: 'Operations Report',
          subtitle: 'Published from API',
        });
        expect(typeof res.body.updatedAt).toBe('number');
      });

    const flowPath = join(
      workspaceRoot,
      '.stargate',
      'flows',
      'ops-report.json',
    );
    const uiPath = join(workspaceRoot, '.stargate', 'ui', 'ops-report.json');
    expect(existsSync(flowPath)).toBe(true);
    expect(existsSync(uiPath)).toBe(true);
    expect(JSON.parse(readFileSync(flowPath, 'utf8'))).toMatchObject({
      id: 'ops-report',
      nodes: [],
    });
  });

  it('GET /flows lists published artifacts and GET /flows/:name/ui returns the schema', async () => {
    await request(app.getHttpServer())
      .get('/flows')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'ops-report',
              title: 'Operations Report',
            }),
          ]),
        );
      });

    await request(app.getHttpServer())
      .get('/flows/ops-report/ui')
      .expect(200)
      .expect({
        title: 'Operations Report',
        subtitle: 'Published from API',
      });
  });

  it('POST /flows rejects duplicate artifacts unless overwrite is true', async () => {
    await request(app.getHttpServer())
      .post('/flows')
      .send({
        name: 'ops-report',
        flow: { id: 'ops-report', nodes: [] },
        ui: { title: 'Duplicate' },
      })
      .expect(409);

    await request(app.getHttpServer())
      .post('/flows')
      .send({
        name: 'ops-report',
        flow: { id: 'ops-report', nodes: [] },
        ui: { title: 'Replaced Report' },
        overwrite: true,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Replaced Report');
      });
  });

  it('POST /flows rejects unsafe names and mismatched flow ids', async () => {
    await request(app.getHttpServer())
      .post('/flows')
      .send({
        name: '../bad',
        flow: {},
        ui: {},
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/flows')
      .send({
        name: 'safe-name',
        flow: { id: 'other-name' },
        ui: {},
      })
      .expect(400);
  });
});
