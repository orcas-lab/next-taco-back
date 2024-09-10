import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../src/config.service';
import { CONFIG_KEY } from '@app/constant';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: CONFIG_KEY,
          useValue: `
[app]          
override=false
`,
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('exists', () => {
    expect(service.get('app.override')).toBeFalsy();
  });
  it('not exists', () => {
    expect(service.get('jwt')).toBeUndefined();
  });
});
