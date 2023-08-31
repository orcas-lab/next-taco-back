import { Injectable } from '@nestjs/common';

@Injectable()
export class BlackListService {
  getHello(): string {
    return 'Hello World!';
  }
}
