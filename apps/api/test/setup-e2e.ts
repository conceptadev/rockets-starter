import { tmpdir } from 'node:os';

process.env.NODE_ENV = 'test';
process.env.MICROSOFT_TENANT_ID ??= '11111111-1111-1111-1111-111111111111';
process.env.MICROSOFT_CLIENT_ID ??= '22222222-2222-2222-2222-222222222222';
process.env.DATABASE_PATH ??= ':memory:';
process.env.STARGATE_WORKSPACE_ROOT ??= tmpdir();
