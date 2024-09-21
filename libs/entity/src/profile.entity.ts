import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import avatar from 'avatars';
import { BlackList } from './black-list.entity';

@Entity({ name: 'Profile' })
export class Profile {
    @PrimaryColumn({ select: true })
    @ApiProperty()
    tid: string;
    @Column()
    @ApiProperty()
    nick: string;
    @Column()
    @ApiProperty()
    avatar: string;
    @Column()
    @ApiProperty()
    description: string;
    @Column()
    @ApiProperty()
    reputation: number;
    @ManyToMany(() => BlackList)
    @JoinTable()
    blackList: BlackList[];
    @Column({ type: 'bigint', default: 0 })
    @ApiProperty()
    friends_total: number;
    @Column()
    @CreateDateColumn()
    @ApiProperty()
    create_at: Date;
    @Column()
    @UpdateDateColumn()
    update_at: Date;
}

export const createProfile = <T extends Record<string, any>>(data: T) => {
    const profile = new Profile();
    profile.tid = data.tid;
    profile.nick = data.nick ?? data.tid;
    profile.avatar = data.avatar ?? avatar({});
    profile.description = '';
    profile.reputation = data.reputation;
    return profile;
};
