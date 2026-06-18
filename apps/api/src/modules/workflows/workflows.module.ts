import { Module } from '@nestjs/common';
import { StargateRuntimeModule } from '../../stargate-runtime.module';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [StargateRuntimeModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
})
export class WorkflowsModule {}
