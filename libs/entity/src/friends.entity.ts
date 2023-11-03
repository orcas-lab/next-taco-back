import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Friend' })
export class Friend {
    @PrimaryColumn({ type: 'uuid' })
    @ApiProperty()
    uuid: string;
    @Column()
    @Index()
    @ApiProperty()
    source: string;
    @Column()
    @Index()
    @ApiProperty()
    target: string;
    @Column()
    @ApiProperty()
    nick: string;
    @Column({ default: 'DEFAULT_GROUP' })
    @ApiProperty()
    tag: string;
    @Column({ default: new Date().getTime(), type: 'bigint' })
    @ApiProperty()
    create_at: number;
    @Column({ default: new Date().getTime(), type: 'bigint' })
    @ApiProperty()
    update_at: number;
    @OneToOne(() => Profile)
    @JoinColumn({ name: 'target' })
    @ApiProperty()
    profile: Profile;
}
