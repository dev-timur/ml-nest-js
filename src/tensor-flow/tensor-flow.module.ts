import { Module } from '@nestjs/common';
import { TensorFlowService } from './tensor-flow.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TensorFlowService],
})
export class TensorFlowModule {}
