import { Test, TestingModule } from '@nestjs/testing';
import { BlackListController } from './black-list.controller';
import { BlackListService } from './black-list.service';

describe('BlackListController', () => {
  let blackListController: BlackListController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlackListController],
      providers: [BlackListService],
    }).compile();

    blackListController = app.get<BlackListController>(BlackListController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(blackListController.getHello()).toBe('Hello World!');
    });
  });
});
