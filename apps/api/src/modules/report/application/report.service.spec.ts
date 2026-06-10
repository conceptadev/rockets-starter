import { Where } from '@bitwild/rockets';
import { CategoryEntity } from '../../category/infrastructure/category.entity';
import { TaskEntity } from '../../task/infrastructure/task.entity';
import { TaskStatus } from '../../task/domain/task-status.enum';
import { ReportService } from './report.service';
import type { RepositoryInterface } from '@bitwild/rockets';

describe('ReportService', () => {
  const categories = {
    count: jest.fn(),
  } as Pick<RepositoryInterface<CategoryEntity>, 'count'>;

  const tasks = {
    count: jest.fn(),
  } as Pick<RepositoryInterface<TaskEntity>, 'count'>;

  let service: ReportService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReportService(
      categories as RepositoryInterface<CategoryEntity>,
      tasks as RepositoryInterface<TaskEntity>,
    );
  });

  it('returns summary counts for the authenticated user', async () => {
    (categories.count as jest.Mock).mockResolvedValue(2);
    (tasks.count as jest.Mock)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(3);

    await expect(service.getSummary('user-1')).resolves.toEqual({
      categoryCount: 2,
      taskCount: 5,
      openTaskCount: 3,
    });

    expect(categories.count).toHaveBeenCalledWith({
      where: Where.eq<CategoryEntity>('userId', 'user-1'),
    });
    expect(tasks.count).toHaveBeenNthCalledWith(1, {
      where: Where.eq<TaskEntity>('userId', 'user-1'),
    });
    expect(tasks.count).toHaveBeenNthCalledWith(2, {
      where: Where.and(
        Where.eq<TaskEntity>('userId', 'user-1'),
        Where.eq<TaskEntity>('status', TaskStatus.TODO),
      ),
    });
  });
});
