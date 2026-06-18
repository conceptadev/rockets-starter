import { ApiProperty } from '@nestjs/swagger';

export class SummarizeResponseDto {
  @ApiProperty({
    description: 'Model-generated summary of the submitted text.',
    example: 'A concise summary of the original content.',
  })
  readonly summary: string;
}
