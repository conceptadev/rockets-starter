import { Injectable } from '@nestjs/common';
import {
  InjectDynamicRepository,
  Where,
  type RepositoryInterface,
} from '@bitwild/rockets';
import { CategoryEntity } from '../../category/infrastructure/category.entity';
import { TaskEntity } from '../../task/infrastructure/task.entity';
import { TaskStatus } from '../../task/domain/task-status.enum';
import { ReportSummaryDto } from './report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectDynamicRepository(CategoryEntity)
    private readonly categories: RepositoryInterface<CategoryEntity>,
    @InjectDynamicRepository(TaskEntity)
    private readonly tasks: RepositoryInterface<TaskEntity>,
  ) {}

  async getSummary(userId: string): Promise<ReportSummaryDto> {
    const [categoryCount, taskCount, openTaskCount] = await Promise.all([
      this.categories.count({
        where: Where.eq<CategoryEntity>('userId', userId),
      }),
      this.tasks.count({
        where: Where.eq<TaskEntity>('userId', userId),
      }),
      this.tasks.count({
        where: Where.and(
          Where.eq<TaskEntity>('userId', userId),
          Where.eq<TaskEntity>('status', TaskStatus.TODO),
        ),
      }),
    ]);

    return { categoryCount, taskCount, openTaskCount };
  }
}
