import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { BudgetModule } from '../src/modules/budget';
import { BudgetSnapshotEntity } from '../src/modules/budget/infrastructure/budget-snapshot.entity';
import { FeatureEstimateEntity } from '../src/modules/budget/infrastructure/feature-estimate.entity';
import { ZohoTaskEntity } from '../src/modules/budget/infrastructure/zoho-task.entity';

describe('Budget (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            BudgetSnapshotEntity,
            FeatureEstimateEntity,
            ZohoTaskEntity,
          ],
          synchronize: true,
          dropSchema: true,
        }),
        BudgetModule,
      ],
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
  });

  it('syncs budget data through Stargate and persists a dashboard snapshot', async () => {
    await request(app.getHttpServer())
      .post('/budget/sync')
      .send({})
      .expect(200)
      .expect((res) => {
        expect(res.body.snapshot.totalBudgetHours).toBe(519);
        expect(res.body.snapshot.accounts).toHaveLength(1);
        expect(res.body.tasks).toHaveLength(1);
      });

    await request(app.getHttpServer())
      .get('/budget/dashboard')
      .expect(200)
      .expect((res) => {
        expect(res.body.snapshot.totalBudgetHours).toBe(519);
      });
  });

  it('estimates a feature using the latest saved budget snapshot', async () => {
    await request(app.getHttpServer())
      .post('/budget/estimate')
      .send({
        featureTitle: 'Budget approval notifications',
        featureDescription:
          'Notify project owners when a new request fits the current available budget.',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.estimates[0].estimatedHours).toBe(42);
        expect(res.body.estimates[0].canFitBudget).toBe(true);
        expect(res.body.estimates[0].recommendation).toContain('Fits within');
        expect(res.body.snapshot.accounts[0].allocatedHours).toBe(42);
        expect(res.body.snapshot.accounts[0].availableHours).toBe(39);
      });
  });

  it('reduces available capacity as estimates accumulate and flags the one that no longer fits', async () => {
    await request(app.getHttpServer())
      .post('/budget/estimate')
      .send({
        featureTitle: 'Second request against the same account',
        featureDescription:
          'A second ask that pushes the account past its remaining capacity.',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.estimates[0].canFitBudget).toBe(false);
        expect(res.body.estimates[0].recommendation).toContain('Exceeds');
        expect(res.body.snapshot.accounts[0].allocatedHours).toBe(84);
        expect(res.body.snapshot.accounts[0].availableHours).toBe(-3);
      });
  });

  it('explains an already-over-capacity account in plain language', async () => {
    await request(app.getHttpServer())
      .post('/budget/estimate')
      .send({
        featureTitle: 'Third request against an already over-capacity account',
        featureDescription:
          'Asked after the account is already negative on available hours.',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.estimates[0].canFitBudget).toBe(false);
        expect(res.body.estimates[0].recommendation).toContain(
          'already 3h over capacity',
        );
      });
  });
});
