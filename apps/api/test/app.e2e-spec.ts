import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MicrosoftTokenVerifierService } from '../src/auth-microsoft';
import { AppUserRole } from '../src/shared/domain/user-role.enum';

describe('App (e2e)', () => {
  let app: INestApplication;

  const verifierStub = {
    isMicrosoftToken: () => true,
    verify: async () => ({
      oid: '00000000-0000-0000-0000-000000000001',
      sub: '00000000-0000-0000-0000-000000000001',
      preferred_username: 'jane@company.com',
      roles: [AppUserRole.ADMIN],
    }),
  };

  beforeEach(async () => {
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
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /me rejects requests without a bearer token', () => {
    return request(app.getHttpServer()).get('/me').expect(401);
  });

  it('GET /me accepts a verified Microsoft token', () => {
    return request(app.getHttpServer())
      .get('/me')
      .set('Authorization', 'Bearer stubbed-microsoft-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe('jane@company.com');
      });
  });

  it('PATCH /me updates user metadata', () => {
    return request(app.getHttpServer())
      .patch('/me')
      .set('Authorization', 'Bearer stubbed-microsoft-token')
      .send({ userMetadata: { firstName: 'Jane', lastName: 'Doe' } })
      .expect(200)
      .expect((res) => {
        expect(res.body.userMetadata.firstName).toBe('Jane');
        expect(res.body.userMetadata.lastName).toBe('Doe');
      });
  });
});
