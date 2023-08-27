import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller()
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}

    @Get()
    async getHello() {
        return await this.tokenService.refresh({
            access_token: '',
            refresh_token: '',
        });
    }
}
