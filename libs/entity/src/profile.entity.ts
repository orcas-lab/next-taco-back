import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Profile' })
export class Profile {
    @PrimaryColumn()
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
    @Column({ type: 'bigint', default: 0 })
    @ApiProperty()
    friends_total: number;
    @Column({ type: 'bigint' })
    @ApiProperty()
    create_at: number;
    @Column({ type: 'bigint' })
    update_at: number;
}

export const createProfile = <T extends Record<string, any>>(data: T) => {
    const profile = new Profile();
    profile.tid = data.tid;
    profile.nick = data.nick ?? data.tid;
    profile.avatar = data.avatar ?? '';
    profile.description = '';
    profile.reputation = data.reputation;
    profile.create_at = new Date().getTime();
    profile.update_at = new Date().getTime();
    return profile;
};
