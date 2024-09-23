import { PubReq } from '@app/entity';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class Message {
  @IsString()
  @IsNotEmpty()
  target: string;
  @IsString()
  msg: string;
  @IsString()
  @IsOptional()
  senderSign?: string;
}

export class Notice {
  @IsNotEmpty()
  @IsString()
  target: string;
}

export class RequestNotice extends Notice {
  @IsNotEmptyObject()
  @IsObject()
  payload: PubReq;
}
