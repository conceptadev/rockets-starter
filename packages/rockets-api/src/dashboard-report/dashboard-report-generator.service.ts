import { FileEntityInterface, FileService } from '@concepta/nestjs-file';
import {
  ReportGeneratorResultInterface,
  ReportGeneratorServiceInterface,
} from '@concepta/nestjs-report';
import { ReportStatusEnum } from '@concepta/ts-common';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { promises as fs } from 'fs';
import { ReportEntity } from '../entities/report.entity';
import { REPORT_KEY_DASHBOARD_REPORT } from './dashboard-report.constants';

@Injectable()
export class DashboardReportGeneratorService
  implements ReportGeneratorServiceInterface
{
  readonly KEY: string = REPORT_KEY_DASHBOARD_REPORT;
  readonly generateTimeout: number = 60000;

  constructor(
    @Inject(FileService)
    private readonly fileService: FileService,
  ) {}

  async getDownloadUrl(report: ReportEntity): Promise<string> {
    if (!report?.file?.id) return '';
    const file = await this.fileService.fetch({ id: report.file.id });
    return file.downloadUrl || '';
  }

  async generate(
    report: ReportEntity,
  ): Promise<ReportGeneratorResultInterface> {
    try {
      const file = await this.pushFileMetadata(report);
      const tempFilePath = await this.createTempFile(report);
      await this.uploadFileContent(file.uploadUri, tempFilePath);
      await this.cleanupTempFile(tempFilePath);

      return this.createSuccessResult(report, file);
    } catch (error) {
      console.error('Error generating report:', error);
      return this.createErrorResult(report, error);
    }
  }

  private async pushFileMetadata(
    report: ReportEntity,
  ): Promise<FileEntityInterface> {
    return this.fileService.push({
      fileName: report.name,
      contentType: 'text/plain',
      serviceKey: 'aws-storage',
    });
  }

  private async createTempFile(report: ReportEntity): Promise<string> {
    const tempFilePath = `/tmp/${report.name}.txt`;
    await fs.writeFile(tempFilePath, `User: fake username`);
    return tempFilePath;
  }

  private async uploadFileContent(
    uploadUrl: string,
    filePath: string,
  ): Promise<void> {
    const fileContent = await fs.readFile(filePath);
    await axios.put(uploadUrl, fileContent, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  private async cleanupTempFile(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  private createSuccessResult(
    report: ReportEntity,
    file: FileEntityInterface,
  ): ReportGeneratorResultInterface {
    return {
      id: report.id,
      status: ReportStatusEnum.Complete,
      file,
    } as ReportGeneratorResultInterface;
  }

  private createErrorResult(
    report: ReportEntity,
    error: Error,
  ): ReportGeneratorResultInterface {
    return {
      id: report.id,
      status: ReportStatusEnum.Error,
      file: null,
      errorMessage: error.message,
    } as ReportGeneratorResultInterface;
  }
}
