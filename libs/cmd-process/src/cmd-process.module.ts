import { Module } from '@nestjs/common';
import { CmdProcessService } from './cmd-process.service';

@Module({
    providers: [CmdProcessService],
    exports: [CmdProcessService],
})
export class CmdProcessModule {}
