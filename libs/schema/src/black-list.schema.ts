import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ autoCreate: true })
export class BlackList {
    @Prop({ required: true, index: true })
    source: string;
    @Prop({ required: true, index: true })
    target: string;
}

export type BlackListDocument = HydratedDocument<BlackList>;
export const BlackListSchema = SchemaFactory.createForClass(BlackList);
