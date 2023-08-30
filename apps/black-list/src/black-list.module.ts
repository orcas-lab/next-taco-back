import { Module } from '@nestjs/common';
import { BlackListController } from './black-list.controller';
import { BlackListService } from './black-list.service';

@Module({
  imports: [],
  controllers: [BlackListController],
  providers: [BlackListService],
})
export class BlackListModule {}
