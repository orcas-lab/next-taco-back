import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Profile' })
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
    @Column({ type: 'bigint', default: 0 })
    friends_total: number;
    @Column({ type: 'bigint' })
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
