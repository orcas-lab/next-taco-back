import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { KeypairModule } from '@app/keypair';

@Module({
    imports: [KeypairModule.forRoot()],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {}
