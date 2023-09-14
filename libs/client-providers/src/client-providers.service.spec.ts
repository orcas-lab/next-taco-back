import { Test, TestingModule } from '@nestjs/testing';
import { ClientProvidersService } from './client-providers.service';

describe('ClientProvidersService', () => {
  let service: ClientProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientProvidersService],
    }).compile();

    service = module.get<ClientProvidersService>(ClientProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
