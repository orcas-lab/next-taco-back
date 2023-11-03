import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryColumn({ type: 'uuid' })
    uuid: string;
    @Column({ type: 'text' })
    sender: string;
    @Column({ type: 'text' })
    target: string;
    @Column()
    msg: string;
}
