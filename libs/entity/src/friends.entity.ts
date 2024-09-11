import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Friend' })
export class Friend {
    @PrimaryColumn({ type: 'uuid' })
    id:string;
    @Column()
    source: string;
    @Column()
    target: string;
    @Column()
    tag:string;
    @Column()
    nick:string;
    @Column()
    @CreateDateColumn()
    create_at: Date;
    @Column()
    @UpdateDateColumn()
    update_at: Date;
    @OneToOne(()=>Profile)
    @JoinColumn({name:'target'})
    profile:Profile;
}
