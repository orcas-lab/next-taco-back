import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ autoCreate: true })
export class Messages {
    @Prop({ required: true })
    sender: string;
    @Prop({ required: true })
    reciver: string;
    @Prop({ required: true })
    message: string;
    @Prop({ required: true })
    pubKey?: string;
    @Prop({ type: () => BigInt, required: true })
    create_at: number;
    @Prop({ required: true })
    type: 'group' | 'single';
}
