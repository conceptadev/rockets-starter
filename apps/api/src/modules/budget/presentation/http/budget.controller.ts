import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BudgetService } from '../../application/budget.service';
import { BudgetDashboardDto } from './dto/budget-dashboard.dto';
import { CreateFeatureEstimateDto } from './dto/create-feature-estimate.dto';

@ApiBearerAuth()
@ApiTags('budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budget: BudgetService) {}

  @Get('dashboard')
  @ApiOkResponse({ type: BudgetDashboardDto })
  dashboard(): Promise<BudgetDashboardDto> {
    return this.budget.getDashboard();
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BudgetDashboardDto })
  sync(): Promise<BudgetDashboardDto> {
    return this.budget.syncBudget();
  }

  @Post('estimate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BudgetDashboardDto })
  estimate(@Body() dto: CreateFeatureEstimateDto): Promise<BudgetDashboardDto> {
    return this.budget.estimateFeature(dto);
  }
}
