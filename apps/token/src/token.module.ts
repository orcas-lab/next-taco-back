import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtModule } from '@app/jwt';
import { ConfigModule } from '@app/config';

@Module({
    imports: [JwtModule.use(), ConfigModule.forRoot('config.toml')],
    controllers: [TokenController],
    providers: [TokenService],
})
export class TokenModule {}
