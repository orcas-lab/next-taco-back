import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

@Schema({ autoCreate: true })
export class Account {
    @Prop({ default: randomUUID(), required: true, index: true })
    tid: string;
    @Prop()
    nick: string;
    @Prop()
    description: string;
    @Prop()
    password: string;
    @Prop()
    email: string;
    @Prop()
    sex: string;
    @Prop({ default: {}, required: true, type: Object })
    question: { [x: string]: string };
    @Prop({ default: '' })
    location: string;
    @Prop({ default: 5 })
    reputation: number;
    @Prop({ default: 0 })
    friend_total: number;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);
