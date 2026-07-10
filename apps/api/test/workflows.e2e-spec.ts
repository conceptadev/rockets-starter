import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MicrosoftTokenVerifierService } from '../src/auth-microsoft';
import { AppUserRole } from '../src/shared/domain/user-role.enum';

describe('Workflows (e2e)', () => {
  let app: INestApplication;
  let previousWorkspaceRoot: string | undefined;
  let workspaceRoot: string;

  const verifierStub = {
    isMicrosoftToken: () => true,
    verify: async () => ({
      oid: '00000000-0000-0000-0000-000000000001',
      sub: '00000000-0000-0000-0000-000000000001',
      preferred_username: 'admin@company.com',
      roles: [AppUserRole.ADMIN],
    }),
  };

  beforeAll(async () => {
    previousWorkspaceRoot = process.env.STARGATE_WORKSPACE_ROOT;
    workspaceRoot = mkdtempSync(join(tmpdir(), 'rockets-stargate-'));
    process.env.STARGATE_WORKSPACE_ROOT = workspaceRoot;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MicrosoftTokenVerifierService)
      .useValue(verifierStub)
      .compile();

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
    await app?.close();
    if (previousWorkspaceRoot === undefined) {
      delete process.env.STARGATE_WORKSPACE_ROOT;
    } else {
      process.env.STARGATE_WORKSPACE_ROOT = previousWorkspaceRoot;
    }
    rmSync(workspaceRoot, { recursive: true, force: true });
  });

  const auth = { Authorization: 'Bearer stubbed-microsoft-token' };

  it('POST /flows publishes a flow and ui schema into the Stargate workspace', async () => {
    await request(app.getHttpServer())
      .post('/flows')
      .set(auth)
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
      .set(auth)
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
      .set(auth)
      .expect(200)
      .expect({
        title: 'Operations Report',
        subtitle: 'Published from API',
      });
  });

  it('POST /flows rejects duplicate artifacts unless overwrite is true', async () => {
    await request(app.getHttpServer())
      .post('/flows')
      .set(auth)
      .send({
        name: 'ops-report',
        flow: { id: 'ops-report', nodes: [] },
        ui: { title: 'Duplicate' },
      })
      .expect(409);

    await request(app.getHttpServer())
      .post('/flows')
      .set(auth)
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
      .set(auth)
      .send({
        name: '../bad',
        flow: {},
        ui: {},
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/flows')
      .set(auth)
      .send({
        name: 'safe-name',
        flow: { id: 'other-name' },
        ui: {},
      })
      .expect(400);
  });
});
