import { Inject, Injectable } from '@nestjs/common';
import { STARGATE_WORKFLOWS } from './stargate.constants';
import { StargateWorkflow } from '../domain/stargate-workflow.interface';
import { WorkflowNotRegisteredError } from '../domain/stargate-errors';

export type AnyStargateWorkflow = StargateWorkflow<never, object, unknown>;

@Injectable()
export class StargateCatalogService {
  private readonly workflows: Map<string, AnyStargateWorkflow>;

  constructor(
    @Inject(STARGATE_WORKFLOWS)
    workflows: readonly AnyStargateWorkflow[],
  ) {
    this.workflows = new Map(
      workflows.map((workflow) => [workflow.key, workflow]),
    );
  }

  get(key: string): AnyStargateWorkflow {
    const workflow = this.workflows.get(key);

    if (!workflow) {
      throw new WorkflowNotRegisteredError(key);
    }

    return workflow;
  }
}
