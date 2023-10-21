import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Profile {
    @PrimaryColumn()
    tid: string;
    @Column()
    nick: string;
    @Column()
    avatar: string;
    @Column()
    description: string;
    @Column()
    reputation: number;
    @Column()
    create_at: number;
    @Column()
    update_at: number;
}
