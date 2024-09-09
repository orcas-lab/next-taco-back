import { Test, TestingModule } from '@nestjs/testing';
import { AutoDatabaseService } from './auto-database.service';

describe('AutoDatabaseService', () => {
  let service: AutoDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoDatabaseService],
    }).compile();

    service = module.get<AutoDatabaseService>(AutoDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
