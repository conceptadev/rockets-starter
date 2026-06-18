import { Logger, Module } from '@nestjs/common';
import { filterStringEnvVars } from '@stargate/server';
import { StargateServerModule } from '@stargate/server/nest';
import { parse as parseDotenv } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const logger = new Logger('Stargate');

function resolveWorkspaceRoot(): string {
  if (process.env.STARGATE_WORKSPACE_ROOT) {
    return resolve(process.env.STARGATE_WORKSPACE_ROOT);
  }

  let directory = process.cwd();

  while (true) {
    if (existsSync(join(directory, '.stargate'))) {
      return directory;
    }

    const parent = dirname(directory);

    if (parent === directory) {
      return process.cwd();
    }

    directory = parent;
  }
}

function readEnvFile(root: string, file: string): Record<string, string> {
  const path = join(root, file);

  if (!existsSync(path)) {
    return {};
  }

  return parseDotenv(readFileSync(path, 'utf8'));
}

function resolveStargateEnv(
  workspaceRoot: string,
): Record<string, string | undefined> {
  const envRoot = process.env.STARGATE_ENV_ROOT
    ? resolve(process.env.STARGATE_ENV_ROOT)
    : workspaceRoot;

  return {
    ...readEnvFile(envRoot, '.env'),
    ...readEnvFile(envRoot, '.env.local'),
    ...process.env,
  };
}

@Module({
  imports: [
    StargateServerModule.registerAsync({
      useFactory: () => {
        const workspaceRoot = resolveWorkspaceRoot();

        return {
          workspaceRoot,
          env: filterStringEnvVars(resolveStargateEnv(workspaceRoot)),
          allowPrivateMcpUrls: process.env.NODE_ENV !== 'production',
          onWarning: (warning: string) => logger.warn(warning),
        };
      },
    }),
  ],
  exports: [StargateServerModule],
})
export class StargateRuntimeModule {}
