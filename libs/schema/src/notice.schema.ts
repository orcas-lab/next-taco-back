import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ autoCreate: true })
export class Notices {
    @Prop({ default: new Types.ObjectId().toString('hex') })
    nid: string;
    @Prop({ required: true })
    sender: string;
    @Prop({ required: true })
    reciver: string;
    @Prop({ required: true })
    group: boolean;
    @Prop({ required: true })
    message: string;
    @Prop({ required: true })
    sign: string;
    @Prop()
    action?: string;
}

export type NoticesDocument = HydratedDocument<Notices>;
export const NoticesSchame = SchemaFactory.createForClass(Notices);
