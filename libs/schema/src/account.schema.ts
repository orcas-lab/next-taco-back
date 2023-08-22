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
    @Prop({ type: () => Object })
    quesion: { [x: string]: string };
    @Prop()
    location: string;
    @Prop({ default: 5 })
    reputation: number;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);
