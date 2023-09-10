import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ autoCreate: true })
export class Friends {
    @Prop({ index: true })
    source: string;
    @Prop({ index: true })
    target: string;
    @Prop({ default: '' })
    tag: string;
    @Prop()
    pet_name: string;
}

export type FriendsDocument = HydratedDocument<Friends>;
export const FriendsSchema = SchemaFactory.createForClass(Friends);
