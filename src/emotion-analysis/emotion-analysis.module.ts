import { Module } from '@nestjs/common';
import { SentimentAnalysisService } from './emotion-analysis.service';
import { SentimentAnalysisController } from './emotion-analysis.controller';

@Module({
  imports: [],
  controllers: [SentimentAnalysisController],
  providers: [SentimentAnalysisService],
})
export class EmotionAnalysisModule {}
