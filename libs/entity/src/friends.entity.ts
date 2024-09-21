import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { randomUUID } from 'crypto';

@Entity({ name: 'Friend' })
export class Friend {
    @PrimaryColumn({ type: 'uuid', default: randomUUID() })
    id: string;
    @Column()
    source: string;
    @Column()
    target: string;
    @Column({ default: '' })
    tag: string;
    @Column({ default: '' })
    nick: string;
    @Column()
    @CreateDateColumn()
    create_at: Date;
    @Column()
    @UpdateDateColumn()
    update_at: Date;
    @OneToOne(() => Profile)
    @JoinColumn({ name: 'target' })
    profile: Profile;
}
