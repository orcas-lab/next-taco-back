import { Test, TestingModule } from '@nestjs/testing';
import { KeysService } from './keys.service';
import { KeysModule } from './keys.module';
import { DEFAULT_EC_OPTIONS, DEFAULT_RSA_OPTIONS } from './constant';
import { join } from 'path';

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
      imports: [
        KeysModule.registerAsync({
          imports: [],
          useFactory: () => {
            return {
              type: 'ec',
              ec: DEFAULT_EC_OPTIONS,
            };
          },
        }),
      ],
    }).compile();

    service = module.get<KeysService>(KeysService);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('SUCCESS should be defined', () => {
    expect(service).toBeDefined();
  });
  it('SUCCESS sign data', () => {
    expect(service.sign('server', 'hello-world')).toBeDefined();
  });
  it('SUCCESS verify', () => {
    expect(
      service.verify(
        'server',
        'hello-world',
        service.sign('server', 'hello-world'),
      ),
    ).toBeDefined();
  });
  it('SUCCESS verify fail (data !== sign.data)', () => {
    expect(
      service.verify(
        'server',
        'hello world',
        service.sign('server', 'hello-world'),
      ),
    ).toBe(false);
  });
  it('FAIL sign data (KEY NOT EXIST)', () => {
    expect(() => service.sign('', '')).toThrow();
  });
  it('SUCCESS generate write', () => {
    service.generate('test', 'rsa', DEFAULT_RSA_OPTIONS, true);
    expect(map.has(join(process.cwd(), 'data', 'test.public'))).toBe(true);
  });
  it('SUCCESS generate not write', () => {
    service.generate('test2', 'rsa', DEFAULT_RSA_OPTIONS, false);
    expect(map.has(join(process.cwd(), 'data', 'test2.public'))).toBe(false);
  });
});
