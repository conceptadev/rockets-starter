/**
 * App smoke e2e without Jest.
 *
 * Jest + ts-jest transforming ESM `@concepta/*` deadlocks on
 * `RocketsModule.forRoot` / `NestFactory.create(AppModule)`.
 * Nest boots fine under plain Node + ts-node.
 */
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { MicrosoftTokenVerifierService } from '../src/auth-microsoft';
import { AppUserRole } from '../src/shared/domain/user-role.enum';

type SuperTest = typeof import('supertest');

function resolveSupertest(): SuperTest {
  const candidate = supertest as unknown as SuperTest & {
    default?: SuperTest;
  };
  return candidate.default ?? candidate;
}

const request = resolveSupertest();

process.env.NODE_ENV = 'test';
process.env.MICROSOFT_TENANT_ID ??= '11111111-1111-1111-1111-111111111111';
process.env.MICROSOFT_CLIENT_ID ??= '22222222-2222-2222-2222-222222222222';
process.env.DATABASE_PATH ??= ':memory:';

type VerifierStub = {
  isMicrosoftToken: () => boolean;
  verify: () => Promise<{
    oid: string;
    sub: string;
    preferred_username: string;
    roles: AppUserRole[];
  }>;
};

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  stubMicrosoftVerifier(app.get(MicrosoftTokenVerifierService));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.init();

  const server = app.getHttpServer();

  await request(server).get('/me').expect(401);

  await request(server)
    .get('/me')
    .set('Authorization', 'Bearer stubbed-microsoft-token')
    .expect(200)
    .expect((res) => {
      if (res.body.email !== 'jane@company.com') {
        throw new Error(`unexpected email: ${String(res.body.email)}`);
      }
    });

  await request(server)
    .patch('/me')
    .set('Authorization', 'Bearer stubbed-microsoft-token')
    .send({ userMetadata: { firstName: 'Jane', lastName: 'Doe' } })
    .expect(200)
    .expect((res) => {
      if (res.body.userMetadata?.firstName !== 'Jane') {
        throw new Error('firstName was not updated');
      }
    });

  await app.close();
  // eslint-disable-next-line no-console
  console.log('app smoke e2e passed');
}

function stubMicrosoftVerifier(verifier: MicrosoftTokenVerifierService): void {
  const stub = verifier as MicrosoftTokenVerifierService & VerifierStub;
  stub.isMicrosoftToken = () => true;
  stub.verify = async () => ({
    oid: '00000000-0000-0000-0000-000000000001',
    sub: '00000000-0000-0000-0000-000000000001',
    preferred_username: 'jane@company.com',
    roles: [AppUserRole.ADMIN],
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
