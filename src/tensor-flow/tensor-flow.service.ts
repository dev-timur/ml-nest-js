import { Injectable } from '@nestjs/common';

@Injectable()
export class TensorFlowService {
  getHello(): string {
    return 'Hello World!';
  }
}
