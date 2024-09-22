import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({})
export class JwtModule {
  static use(): DynamicModule {
    return {
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtService],
      global: true,
    };
  }
}
