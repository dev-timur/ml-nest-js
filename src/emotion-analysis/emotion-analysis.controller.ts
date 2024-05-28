// src/sentiment-analysis/sentiment-analysis.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { SentimentAnalysisService } from './emotion-analysis.service';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class AnalyzeTextDto {
  @ApiProperty({ description: 'Текст для анализа' })
  text: string;
}

@Controller('sentiment-analysis')
export class SentimentAnalysisController {
  constructor(
    private readonly sentimentAnalysisService: SentimentAnalysisService,
  ) {}

  @Post('analyze')
  @ApiBody({ type: AnalyzeTextDto })
  analyzeText(@Body() analyzeTextDto: AnalyzeTextDto) {
    console.log('analyzeTextDto', analyzeTextDto);

    return this.sentimentAnalysisService.classifyText(analyzeTextDto.text);
  }

  @Post('test')
  @ApiBody({ type: AnalyzeTextDto })
  test() {
    return this.sentimentAnalysisService.testClassifier();
  }

  // @Post('analyze')
  // @ApiBody({ type: AnalyzeTextDto })
  // async analyzeText(@Body('text') text: string): Promise<any> {
  //   console.log('text', text);

  //   const prediction =
  //     await this.sentimentAnalysisService.analyzeSentiment(text);
  //   return prediction.dataSync();
}
