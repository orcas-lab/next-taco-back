import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

describe('RequestController', () => {
  let requestController: RequestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [RequestService],
    }).compile();

    requestController = app.get<RequestController>(RequestController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(requestController.getHello()).toBe('Hello World!');
    });
  });
});
