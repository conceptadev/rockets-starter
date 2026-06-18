class WorkflowRunnerService {
  async create() {
    return {
      execute: async () => ({
        status: 'completed',
        results: {
          format: {
            summary: 'test summary',
          },
        },
        errors: [],
      }),
      dispose: async () => undefined,
    };
  }
}

class FlowService {
  async read() {
    return { spec: { id: 'flow' }, mtime: 0 };
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
