class FlowService {
  async read(flow) {
    return { id: flow, nodes: [] };
  }
}

class WorkspaceService {
  workspace = {
    fs: {
      readFile: async () => Buffer.from(''),
      writeFile: async () => undefined,
      readdir: async () => [],
    },
  };
}

class WorkspaceMcpServersService {
  async registryWithFreshMcpServers(base) {
    return base;
  }
}

const MCP_SERVER_MANAGER = Symbol('MCP_SERVER_MANAGER');

const mcpManager = {
  list: async () => [],
  call: async () => ({ content: [] }),
};

class StargateServerModule {
  static registerAsync() {
    return {
      module: StargateServerModule,
      providers: [
        FlowService,
        WorkspaceService,
        WorkspaceMcpServersService,
        { provide: MCP_SERVER_MANAGER, useValue: mcpManager },
      ],
      exports: [
        FlowService,
        WorkspaceService,
        WorkspaceMcpServersService,
        MCP_SERVER_MANAGER,
      ],
    };
  }
}

module.exports = {
  StargateServerModule,
  FlowService,
  WorkspaceService,
  WorkspaceMcpServersService,
  MCP_SERVER_MANAGER,
};
