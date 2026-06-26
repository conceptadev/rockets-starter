export interface ZohoTasksWorkflowInput {
  readonly accessToken?: string;
  readonly since?: string;
}

export interface ZohoTasksWorkflowOutput {
  readonly source: 'zoho-simulated';
  readonly generatedAt: string;
  readonly tasks: readonly ZohoTask[];
}

export interface ZohoTask {
  readonly id: string;
  readonly title: string;
  readonly projectId: string;
  readonly bucketKey: string;
  readonly requester: string;
  readonly priority: 'low' | 'medium' | 'high';
  readonly status: 'new' | 'triaged' | 'estimated';
  readonly requestedAt: string;
  readonly estimatedHours: number;
  readonly loggedHours: number;
  readonly totalHours: number;
}
