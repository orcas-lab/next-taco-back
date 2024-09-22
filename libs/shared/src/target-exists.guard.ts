import { Account } from '@app/entity';
import { GlobalError } from '@app/error';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { isNil } from 'ramda';
import { Repository } from 'typeorm';

@Injectable()
export class TargetExistsGuard implements CanActivate {
  constructor(
    @InjectRepository(Account)
    private readonly account: Repository<Account>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const tid = req.query.target ?? req.body.target ?? req.params.target;
    const accountInfo = await this.account.findOne({
      where: { tid },
      select: { tid: true },
    });
    if (isNil(accountInfo)) {
      throw GlobalError.TARGET_NOT_EXISTS;
    }
    return true;
  }
}
