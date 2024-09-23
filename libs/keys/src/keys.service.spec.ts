import { Test, TestingModule } from '@nestjs/testing';
import { KeysService } from './keys.service';
import { KeysModule } from './keys.module';

const map = new Map();

jest.mock('node:fs', () => {
  return {
    existsSync: () => false,
    mkdirSync: () => {},
    writeFileSync: (file: string, content: string) => {
      map.set(file, content);
      return content;
    },
  };
});

describe('KeysService', () => {
  let service: KeysService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [KeysModule.use(false)],
    }).compile();

    service = module.get<KeysService>(KeysService);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('SUCCESS should be defined', () => {
    expect(service).toBeDefined();
  });
  it('SUCCESS sign data (not object)', () => {
    expect(service.sign('hello-world')).toBeDefined();
  });
  it('FAIL sign data (object)', () => {
    expect(() => service.sign({ foo: 'bar' })).toThrow();
  });
  it('SUCCESS verify', () => {
    expect(service.verify('hello-world', service.sign('hello-world'))).toBe(
      true,
    );
  });
  it('SUCCESS verify fail (data !== sign.data)', () => {
    expect(service.verify('hello world', service.sign('hello-world'))).toBe(
      false,
    );
  });
  it('SUCCESS verify fail (data !== signature)', () => {
    expect(service.verify('hello-world', service.sign('hello world'))).toBe(
      false,
    );
  });
});
