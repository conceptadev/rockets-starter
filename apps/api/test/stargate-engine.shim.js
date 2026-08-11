const ExecutionStatus = {
  Running: 'running',
  Completed: 'completed',
  Canceled: 'canceled',
  Waiting: 'waiting',
  Failed: 'failed',
  PartialSuccess: 'partial_success',
};

class WorkflowEngine {
  constructor(options) {
    this.options = options;
  }

  async execute() {
    return {
      status: ExecutionStatus.Completed,
      results: {
        format: {
          summary: 'test summary',
        },
      },
      errors: [],
    };
  }

  async dispose() {
    return undefined;
  }
}

module.exports = {
  ExecutionStatus,
  WorkflowEngine,
};
