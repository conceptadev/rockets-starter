import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StargateExecutionService } from '../../stargate/application/stargate-execution.service';
import { BudgetSnapshotEntity } from '../infrastructure/budget-snapshot.entity';
import { FeatureEstimateEntity } from '../infrastructure/feature-estimate.entity';
import { ZohoTaskEntity } from '../infrastructure/zoho-task.entity';
import {
  BudgetDashboard,
  BudgetSnapshot,
  FeatureEstimate,
} from './budget.types';
import { CreateFeatureEstimateDto } from '../presentation/http/dto/create-feature-estimate.dto';
import { budgetWorkflow } from '../../workflows/application/flows/budget.workflow';
import { featureEstimateWorkflow } from '../../workflows/application/flows/feature-estimate.workflow';
import { zohoTasksWorkflow } from '../../workflows/application/flows/zoho-tasks.workflow';
import { BudgetWorkflowOutput } from '../../workflows/application/budget-workflow.types';
import { ZohoTask } from '../../workflows/application/zoho-tasks-workflow.types';

const STALE_THRESHOLD_HOURS = 36;

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetSnapshotEntity)
    private readonly snapshots: Repository<BudgetSnapshotEntity>,
    @InjectRepository(FeatureEstimateEntity)
    private readonly estimates: Repository<FeatureEstimateEntity>,
    @InjectRepository(ZohoTaskEntity)
    private readonly tasks: Repository<ZohoTaskEntity>,
    private readonly stargate: StargateExecutionService,
  ) {}

  async getDashboard(): Promise<BudgetDashboard> {
    const [budget, tasks] = await Promise.all([
      this.runBudgetWorkflow(),
      this.runTasksWorkflow(),
    ]);

    return {
      snapshot: this.toWorkflowSnapshot(budget, new Map()),
      tasks: tasks.tasks.map((task) => this.toWorkflowTask(task)),
      estimates: [],
    };
  }

  async syncBudget(): Promise<BudgetDashboard> {
    return this.getDashboard();
  }

  async estimateFeature(
    dto: CreateFeatureEstimateDto,
  ): Promise<BudgetDashboard> {
    const budget = this.toWorkflowSnapshot(await this.runBudgetWorkflow(), new Map());
    const selectedAccount =
      budget.accounts.find((account) => account.projectId === dto.projectId) ??
      budget.accounts[0];

    if (!selectedAccount) {
      throw new BadRequestException(
        'No budget accounts available to estimate against. Run Sync Zoho first.',
      );
    }

    const output = await this.stargate.run(featureEstimateWorkflow, {
      featureTitle: dto.featureTitle,
      featureDescription: dto.featureDescription,
      budgetAvailableHours: selectedAccount.availableHours,
      accounts: budget.accounts,
    });
    const canFitBudget =
      output.estimatedHours <= selectedAccount.availableHours;
    const recommendation = buildRecommendation(
      selectedAccount.name,
      selectedAccount.availableHours,
      output.estimatedHours,
      canFitBudget,
    );

    const dashboard = await this.getDashboard();

    return {
      ...dashboard,
      estimates: [
        {
          id: `estimate-${Date.now()}`,
          projectId: selectedAccount.projectId,
          featureTitle: output.featureTitle,
          featureDescription: dto.featureDescription,
          estimatedHours: output.estimatedHours,
          confidence: output.confidence,
          canFitBudget,
          budgetAvailableHours: selectedAccount.availableHours,
          codeAnalysis: output.codeAnalysis,
          recommendation,
          dateCreated: new Date().toISOString(),
        },
      ],
    };
  }

  private runBudgetWorkflow() {
    return this.stargate.run(budgetWorkflow, {
      requestId: `budget-sync-${Date.now()}`,
    });
  }

  private runTasksWorkflow() {
    return this.stargate.run(zohoTasksWorkflow, {
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  private async captureBudget(): Promise<BudgetSnapshotEntity> {
    const output = await this.stargate.run(budgetWorkflow, {
      requestId: `budget-sync-${Date.now()}`,
    });

    return this.snapshots.save(
      this.snapshots.create({
        sequence: Date.now(),
        snapshotId: output.snapshotId,
        capturedAt: new Date(output.capturedAt),
        source: output.source,
        alerts: [...output.alerts],
        accounts: [...output.accounts],
      }),
    );
  }

  private async captureTasks(): Promise<void> {
    const output = await this.stargate.run(zohoTasksWorkflow, {
      since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });

    await this.tasks.upsert(
      output.tasks.map((task) =>
        this.tasks.create({
          zohoId: task.id,
          title: task.title,
          projectId: task.projectId,
          bucketKey: task.bucketKey,
          requester: task.requester,
          priority: task.priority,
          status: task.status,
          estimatedHours: Number(task.estimatedHours) || 0,
          loggedHours: Number(task.loggedHours) || 0,
          requestedAt: new Date(task.requestedAt),
        }),
      ),
      ['zohoId'],
    );
  }

  private latestSnapshot(): Promise<BudgetSnapshotEntity | null> {
    return this.snapshots.findOne({
      where: {},
      order: { sequence: 'DESC' },
    });
  }

  private async allocatedHoursByProject(): Promise<Map<string, number>> {
    const rows = await this.estimates
      .createQueryBuilder('estimate')
      .select('estimate.projectId', 'projectId')
      .addSelect('SUM(estimate.estimatedHours)', 'allocatedHours')
      .groupBy('estimate.projectId')
      .getRawMany<{ projectId: string; allocatedHours: string | number }>();

    return new Map(
      rows.map((row) => [row.projectId, Number(row.allocatedHours) || 0]),
    );
  }

  private toSnapshot(
    entity: BudgetSnapshotEntity,
    allocatedHoursByProject: Map<string, number>,
  ): BudgetSnapshot {
    const accounts = Array.isArray(entity.accounts) ? entity.accounts : [];
    const source =
      entity.source && typeof entity.source === 'object'
        ? entity.source
        : {
            app: 'legacy-budget-snapshot',
            report: 'legacy',
            owner: 'unknown',
          };

    const syncAgeHours = Math.max(
      0,
      Math.round((Date.now() - entity.dateCreated.getTime()) / 3_600_000),
    );

    return {
      id: entity.id,
      snapshotId: entity.snapshotId,
      capturedAt: entity.capturedAt.toISOString(),
      source,
      syncAgeHours,
      stale: syncAgeHours > STALE_THRESHOLD_HOURS,
      alerts: Array.isArray(entity.alerts) ? entity.alerts : [],
      totalBudgetHours: accounts.reduce(
        (total, account) => total + account.totalBudgetHours,
        0,
      ),
      accounts: accounts.map((account) => {
        const allocatedHours =
          allocatedHoursByProject.get(account.projectId) ?? 0;

        return {
          ...account,
          allocatedHours,
          availableHours: account.remainingHours - allocatedHours,
        };
      }),
    };
  }

  private toWorkflowSnapshot(
    output: BudgetWorkflowOutput,
    allocatedHoursByProject: Map<string, number>,
  ): BudgetSnapshot {
    return {
      id: output.snapshotId,
      snapshotId: output.snapshotId,
      capturedAt: output.capturedAt,
      source: output.source,
      syncAgeHours: 0,
      stale: false,
      alerts: output.alerts,
      totalBudgetHours: output.accounts.reduce(
        (total, account) => total + account.totalBudgetHours,
        0,
      ),
      accounts: output.accounts.map((account) => {
        const allocatedHours =
          allocatedHoursByProject.get(account.projectId) ?? 0;

        return {
          ...account,
          allocatedHours,
          availableHours: account.remainingHours - allocatedHours,
        };
      }),
    };
  }

  private toWorkflowTask(task: ZohoTask): ZohoTask {
    const estimatedHours = Number(task.estimatedHours) || 0;
    const loggedHours = Number(task.loggedHours) || 0;

    return {
      ...task,
      estimatedHours,
      loggedHours,
      totalHours: estimatedHours + loggedHours,
    };
  }

  private toTask(entity: ZohoTaskEntity): ZohoTask {
    return {
      id: entity.zohoId,
      title: entity.title,
      projectId: entity.projectId,
      bucketKey: entity.bucketKey,
      requester: entity.requester,
      priority: entity.priority,
      status: entity.status,
      estimatedHours: entity.estimatedHours,
      loggedHours: entity.loggedHours,
      totalHours: entity.estimatedHours + entity.loggedHours,
      requestedAt: entity.requestedAt.toISOString(),
    };
  }

  private toEstimate(entity: FeatureEstimateEntity): FeatureEstimate {
    return {
      id: entity.id,
      projectId: entity.projectId,
      featureTitle: entity.featureTitle,
      featureDescription: entity.featureDescription,
      estimatedHours: entity.estimatedHours,
      confidence: entity.confidence,
      canFitBudget: entity.canFitBudget,
      budgetAvailableHours: entity.budgetAvailableHours,
      codeAnalysis: entity.codeAnalysis,
      recommendation: entity.recommendation,
      dateCreated: entity.dateCreated.toISOString(),
    };
  }
}

function buildRecommendation(
  accountName: string,
  availableHours: number,
  estimatedHours: number,
  canFitBudget: boolean,
): string {
  if (canFitBudget) {
    return `Fits within the ${availableHours}h available on ${accountName}.`;
  }

  if (availableHours < 0) {
    const projectedOverage = estimatedHours + Math.abs(availableHours);

    return `${accountName} is already ${Math.abs(availableHours)}h over capacity. Adding this ${estimatedHours}h request pushes it to ${projectedOverage}h over. Reduce scope or free up capacity before approving.`;
  }

  const overage = estimatedHours - availableHours;

  return `Exceeds the ${availableHours}h available on ${accountName} by ${overage}h. Reduce scope or free up capacity before approving.`;
}
