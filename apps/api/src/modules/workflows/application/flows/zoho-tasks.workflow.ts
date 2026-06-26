import { StargateWorkflow } from '../../../stargate/domain/stargate-workflow.interface';
import { WorkflowOutputError } from '../../../stargate/domain/stargate-errors';
import {
  ZohoTasksWorkflowInput,
  ZohoTasksWorkflowOutput,
} from '../zoho-tasks-workflow.types';

interface ZohoTasksWorkflowResults {
  readonly format: {
    readonly output: ZohoTasksWorkflowOutput;
  };
}

export const zohoTasksWorkflow: StargateWorkflow<
  ZohoTasksWorkflowInput,
  ZohoTasksWorkflowResults,
  ZohoTasksWorkflowOutput
> = {
  key: 'zoho-tasks',
  flow: process.env.STARGATE_ZOHO_TASKS_FLOW ?? 'zoho-tasks',
  description: 'Simulates reading new tasks from Zoho Creator.',

  toInputs: ({ accessToken, since }) => ({ accessToken, since }),

  parseResults: (results) => {
    const output = normalizeZohoTasksOutput(results.format?.output);

    if (!output) {
      throw new WorkflowOutputError(
        'Stargate workflow did not include results.format.output',
      );
    }

    return { format: { output } };
  },

  toOutput: ({ format }) => format.output,
};

function normalizeZohoTasksOutput(
  value: unknown,
): ZohoTasksWorkflowOutput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const output = value as Partial<
    ZohoTasksWorkflowOutput & {
      readonly projects: readonly {
        readonly id: string;
        readonly name: string;
        readonly u1: string | number;
        readonly u2: string | number;
        readonly u3: string | number;
        readonly u4: string | number;
        readonly u5: string | number;
      }[];
      readonly buckets: readonly {
        readonly key: string;
        readonly label: string;
        readonly e1: string | number;
        readonly e2: string | number;
        readonly e3: string | number;
      }[];
    }
  >;

  if (
    output.source === 'zoho-simulated' &&
    typeof output.generatedAt === 'string' &&
    Array.isArray(output.tasks)
  ) {
    return {
      source: output.source,
      generatedAt: output.generatedAt,
      tasks: output.tasks.map((task) => normalizeTask(task)),
    };
  }

  if (
    output.source !== 'zoho-simulated' ||
    typeof output.generatedAt !== 'string' ||
    !Array.isArray(output.projects) ||
    !Array.isArray(output.buckets)
  ) {
    return null;
  }

  const requesters = ['Ops', 'Support', 'Eng'] as const;
  const priorities = ['high', 'medium', 'low'] as const;
  const statuses = ['new', 'triaged', 'estimated'] as const;

  return {
    source: output.source,
    generatedAt: output.generatedAt,
    tasks: output.projects.flatMap((project) =>
      output.buckets!.flatMap((bucket, bucketIndex) =>
        [bucket.e1, bucket.e2, bucket.e3].map((estimatedHours, taskIndex) => {
            const usedTotal = Number(project[`u${bucketIndex + 1}`]) || 0;
            const firstTwoUsed = Math.floor(usedTotal / 3);
            const loggedHours =
              taskIndex < 2 ? firstTwoUsed : usedTotal - firstTwoUsed * 2;

            return {
              id: `zt-${project.id}-${bucketIndex}-${taskIndex}`,
              title: `${project.name} ${bucket.label} task ${taskIndex + 1}`,
              projectId: project.id,
              bucketKey: bucket.key,
              requester: requesters[taskIndex] ?? 'Ops',
              priority: priorities[taskIndex] ?? 'medium',
              status: statuses[taskIndex] ?? 'new',
              requestedAt: '2026-06-24',
              estimatedHours: Number(estimatedHours) || 0,
              loggedHours,
              totalHours: (Number(estimatedHours) || 0) + loggedHours,
            };
          }),
      ),
    ),
  };
}

function normalizeTask(
  task: ZohoTasksWorkflowOutput['tasks'][number],
): ZohoTasksWorkflowOutput['tasks'][number] {
  const estimatedHours = Number(task.estimatedHours) || 0;
  const loggedHours = Number(task.loggedHours) || 0;

  return {
    ...task,
    estimatedHours,
    loggedHours,
    totalHours: estimatedHours + loggedHours,
  };
}
