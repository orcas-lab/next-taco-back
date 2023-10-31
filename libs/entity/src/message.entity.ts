import { Column, Index, PrimaryColumn } from 'typeorm';

export class Message {
    @PrimaryColumn({ type: 'uuid' })
    uuid: string;
    @Index()
    @Column({ type: 'string' })
    sender: string;
    @Index()
    @Column({ type: 'string' })
    target: string;
    @Column()
    msg: string;
}
