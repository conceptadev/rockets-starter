import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { WorkflowsModule } from '../src/modules/workflows/workflows.module';

describe('Workflows (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WorkflowsModule],
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
});
