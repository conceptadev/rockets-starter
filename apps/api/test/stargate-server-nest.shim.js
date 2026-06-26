class WorkflowRunnerService {
  async create(spec) {
    return {
      execute: async () => ({
        status: 'completed',
        results: resultsFor(spec.id),
        errors: [],
      }),
      dispose: async () => undefined,
    };
  }
}

function resultsFor(flow) {
  if (flow === 'budget') {
    return {
      format: {
        output: {
          snapshotId: '51447000000377349-2026-06-15T08:00:00Z',
          capturedAt: '2026-06-15T08:00:00Z',
          source: {
            app: 'concepta-budget-tracker',
            report: 'Account_Budget_Report',
            owner: 'conceptatech',
          },
          syncAgeHours: 12,
          stale: false,
          alerts: [
            {
              id: 'alert-service-finance',
              accountName: 'Service Finance',
              severity: 'warning',
              message: 'Service Finance is approaching budget threshold.',
            },
          ],
          accounts: [
            {
              projectId: '51447000000377349',
              sprintId: '51447000012128128',
              name: 'Service Finance',
              cycle: 'Maint SP27 · Jun 1 to 30 (2026) · 4-wk',
              startDate: '2026-06-01',
              endDate: '2026-06-30',
              durationWeeks: 4,
              totalBudgetHours: 519,
              loggedHours: 438,
              remainingHours: 81,
              utilizationPct: 84,
              unclassifiedHours: 29,
              unclassifiedPct: 7,
              buckets: [
                {
                  key: 'maintenance',
                  label: 'Maintenance / Development',
                  budgetHours: 207,
                  loggedHours: 174,
                  remainingHours: 33,
                  utilizationPct: 84,
                  health: 'green',
                },
              ],
              health: 'green',
            },
          ],
        },
      },
    };
  }

  if (flow === 'feature-estimate') {
    return {
      format: {
        output: {
          featureTitle: 'Budget approval notifications',
          estimatedHours: 42,
          confidence: 'medium',
          canFitBudget: true,
          budgetAvailableHours: 68,
          codeAnalysis: {
            touchedAreas: ['apps/api/src/modules', 'apps/web/src/app'],
            riskLevel: 'medium',
            notes: ['Requires API orchestration', 'Requires dashboard wiring'],
          },
          recommendation: 'Fits the current budget if scope stays focused.',
        },
      },
    };
  }

  if (flow === 'zoho-tasks') {
    return {
      format: {
        output: {
          source: 'zoho-simulated',
          generatedAt: '2026-06-24T12:00:00.000Z',
          tasks: [
            {
              id: 'zoho-task-1001',
              title: 'Add budget approval notifications',
              projectId: '51447000000377349',
              bucketKey: 'planning_ops',
              requester: 'Operations',
              priority: 'high',
              status: 'new',
              requestedAt: '2026-06-24T09:15:00.000Z',
            },
          ],
        },
      },
    };
  }

  return {
    format: {
      summary: 'test summary',
    },
  };
}

class FlowService {
  async read(flow) {
    return { spec: { id: flow }, mtime: 0 };
  }
}

class StargateServerModule {
  static registerAsync() {
    return {
      module: StargateServerModule,
      providers: [WorkflowRunnerService, FlowService],
      exports: [WorkflowRunnerService, FlowService],
    };
  }
}

module.exports = {
  StargateServerModule,
  WorkflowRunnerService,
  FlowService,
};
