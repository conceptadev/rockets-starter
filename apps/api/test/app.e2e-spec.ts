import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / returns welcome message without auth', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /categories works without a bearer token (fake auth)', () => {
    return request(app.getHttpServer()).get('/categories').expect(200);
  });

  it('GET /announcements is public (guard skipped)', () => {
    return request(app.getHttpServer()).get('/announcements').expect(200);
  });

  it('POST /announcements is public (no actor / owner hook required)', () => {
    return request(app.getHttpServer())
      .post('/announcements')
      .send({
        title: 'Welcome',
        body: 'Public announcements do not require authentication.',
      })
      .expect(201);
  });
});
