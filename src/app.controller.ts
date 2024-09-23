import { KeysService } from '@app/keys';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

export class ServerKeysInfo {
  @ApiProperty({ description: '公钥类型' })
  type: string;
  @ApiProperty({ description: '公钥信息' })
  publicKey: string;
  @ApiProperty({ description: '签名信息' })
  signingAlgorithms: string;
}
export class ServerInfo {
  @ApiProperty({ description: '公钥信息' })
  keys: ServerKeysInfo;
}

@Controller()
export class AppController {
  constructor(private key: KeysService) {}
  @Get()
  @ApiOperation({
    description: '获取服务器信息',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ServerInfo })
  getInfo() {
    const info = new ServerInfo();
    const keyInfo = new ServerKeysInfo();
    keyInfo.type = 'ec';
    info.keys = keyInfo;
  }
}
