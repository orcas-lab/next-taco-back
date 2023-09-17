import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TokenPair } from '@app/dto';
import { WrapperString, WrapperStruct } from '@app/dto/wrapper';

@Controller()
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}
    @GrpcMethod('TokenService', 'sign')
    async sign(data: WrapperStruct) {
        return this.tokenService.sign(data.value);
    }
    @GrpcMethod('TokenService', 'verify')
    verifyToken(pair: TokenPair) {
        return { value: this.tokenService.verify(pair) };
    }
    @GrpcMethod('TokenService', 'refresh')
    refreshToken(pair: TokenPair) {
        return this.tokenService.refresh(pair);
    }
    @GrpcMethod('TokenService', 'decode')
    async decodeToken(access_token: WrapperString) {
        return { value: await this.tokenService.decode(access_token.value) };
    }
    @GrpcMethod('TokenService', 'revoke')
    revokeToken(access_token: WrapperString) {
        console.log(access_token);
        return { value: this.tokenService.revoke(access_token.value) };
    }
}
