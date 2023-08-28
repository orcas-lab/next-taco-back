import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TokenPair } from '@app/dto';

@Controller()
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}
    @GrpcMethod('token', 'sign')
    signToken(data: Record<string, any>) {
        return this.tokenService.sign(data);
    }
    @GrpcMethod('token', 'verify')
    verifyToken(pair: TokenPair) {
        return this.tokenService.verify(pair);
    }
    @GrpcMethod('token', 'refresh')
    refreshToken(pair: TokenPair) {
        return this.tokenService.refresh(pair);
    }
    @GrpcMethod('token', 'decode')
    decodeToken(access_token: string) {
        return this.tokenService.decode(access_token);
    }
    @GrpcMethod('token', 'revoke')
    revokeToken(access_token: string) {
        return this.tokenService.revoke(access_token);
    }
}
