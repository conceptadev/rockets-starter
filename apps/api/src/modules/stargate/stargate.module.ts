import { DynamicModule, Module } from '@nestjs/common';
import { StargateRuntimeModule } from '../../stargate-runtime.module';
import {
  AnyStargateWorkflow,
  StargateCatalogService,
} from './application/stargate-catalog.service';
import { STARGATE_WORKFLOWS } from './application/stargate.constants';
import { StargateExecutionService } from './application/stargate-execution.service';
import { STARGATE_RUNTIME } from './application/ports/stargate-runtime.port';
import { StargateWorkflowRuntimeService } from './infrastructure/stargate/stargate-workflow-runtime.service';

export interface StargateModuleOptions {
  readonly workflows?: readonly AnyStargateWorkflow[];
}

@Module({})
export class StargateModule {
  static register(options: StargateModuleOptions = {}): DynamicModule {
    return {
      module: StargateModule,
      imports: [StargateRuntimeModule],
      providers: [
        {
          provide: STARGATE_WORKFLOWS,
          useValue: options.workflows ?? [],
        },
        StargateCatalogService,
        StargateExecutionService,
        StargateWorkflowRuntimeService,
        {
          provide: STARGATE_RUNTIME,
          useExisting: StargateWorkflowRuntimeService,
        },
      ],
      exports: [StargateCatalogService, StargateExecutionService],
    };
  }
}
