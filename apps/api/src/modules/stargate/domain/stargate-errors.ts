export class WorkflowUnavailableError extends Error {
  constructor(
    readonly flow: string,
    options?: { cause?: unknown },
  ) {
    super(`Workflow "${flow}" is unavailable`, options);
    this.name = WorkflowUnavailableError.name;
  }
}

export class WorkflowNotRegisteredError extends Error {
  constructor(readonly workflowKey: string) {
    super(`Workflow "${workflowKey}" is not registered`);
    this.name = WorkflowNotRegisteredError.name;
  }
}

export class WorkflowExecutionError extends Error {
  readonly code?: string;
  readonly nodeId?: string;
  readonly status?: string;

  constructor(
    readonly flow: string,
    message: string,
    options: {
      code?: string;
      nodeId?: string;
      status?: string;
      cause?: unknown;
    } = {},
  ) {
    super(message, options);
    this.name = WorkflowExecutionError.name;
    this.code = options.code;
    this.nodeId = options.nodeId;
    this.status = options.status;
  }
}

export class WorkflowOutputError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = WorkflowOutputError.name;
  }
}
