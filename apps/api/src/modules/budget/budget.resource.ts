import { defineModuleResource } from '@bitwild/rockets';
import { BudgetSnapshotEntity } from './infrastructure/budget-snapshot.entity';
import { FeatureEstimateEntity } from './infrastructure/feature-estimate.entity';
import { ZohoTaskEntity } from './infrastructure/zoho-task.entity';

export const budgetResource = defineModuleResource({
  entities: [
    { key: 'budgetSnapshot', entity: BudgetSnapshotEntity },
    { key: 'featureEstimate', entity: FeatureEstimateEntity },
    { key: 'zohoTask', entity: ZohoTaskEntity },
  ],
});
