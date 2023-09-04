import { Prop } from '@nestjs/mongoose';

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
}
