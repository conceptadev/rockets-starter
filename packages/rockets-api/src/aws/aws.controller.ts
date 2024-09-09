import { FileCreateDto, FileService } from '@concepta/nestjs-file';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('aws')
@ApiTags('aws')
export class AwsController {
  constructor(private fileService: FileService) {}

  @Post('')
  @ApiResponse({
    description: 'Create a file and return upload and download url',
  })
  async create(@Body() fileDto: FileCreateDto) {
    return this.fileService.push({
      ...fileDto,
      serviceKey: 'aws-storage',
    });
  }

  @Get('')
  @ApiResponse({
    description: 'Get file created',
  })
  async get(fileId: string) {
    return this.fileService.fetch({
      id: fileId,
    });
  }
}
