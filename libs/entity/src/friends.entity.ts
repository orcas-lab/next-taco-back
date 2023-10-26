import { Column, Entity, Index, OneToOne, PrimaryColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'Friend' })
export class Friend {
    @PrimaryColumn({ type: 'uuid' })
    uuid: string;
    @Index()
    @Column()
    source: string;
    @Index()
    @Column()
    target: string;
    @Column()
    nick: string;
    @Column({ default: 'DEFAULT_GROUP' })
    tag: string;
    @Column({ default: new Date().getTime(), type: 'bigint' })
    create_at: number;
    @Column({ default: new Date().getTime(), type: 'bigint' })
    update_at: number;
    @OneToOne(() => Profile)
    profile: Profile;
}
