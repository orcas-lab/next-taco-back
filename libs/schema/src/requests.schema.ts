import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Requests {
    @Prop({ index: true })
    rid: string;
    @Prop()
    sender: string;
    @Prop()
    reciver: string;
    @Prop()
    create_at: number;
    @Prop()
    update_at: number;
    @Prop({ required: true })
    sign: string;
    @Prop()
    meta: Record<string, string>;
    @Prop()
    cmd: string;
}

export type RequestsDocument = HydratedDocument<Requests>;
export const RequestSchema = SchemaFactory.createForClass(Requests);
