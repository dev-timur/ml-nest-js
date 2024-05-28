import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmotionAnalysisModule } from './emotion-analysis/emotion-analysis.module';

@Module({
  imports: [EmotionAnalysisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
