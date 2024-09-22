import { Test, TestingModule } from '@nestjs/testing';
import { PusherGateway } from '../PusherGateway';
import { PusherService } from '../pusher.service';
import { JwtModule } from '@app/jwt';
import { ConfigureModule } from '@app/configure';

describe.skip('PusherGateway', () => {
  let gateway: PusherGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.use(), ConfigureModule.forRoot('config.toml')],
      providers: [
        PusherGateway,
        {
          provide: PusherService,
          useValue: {
            persistence: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    gateway = module.get<PusherGateway>(PusherGateway);
  }, 60 * 1000);

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
