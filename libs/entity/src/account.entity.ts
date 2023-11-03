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

@Entity({ name: 'Account' })
export class Account {
    @PrimaryColumn({ select: true })
    @ApiProperty()
    tid: string;
    @Column()
    @ApiProperty()
    email: string;
    @Column()
    @ApiProperty()
    password: string;
    @Column({ type: 'json' })
    @ApiProperty()
    question: {
        [x: string]: string | number | boolean;
    };
    @Column({ default: true })
    @ApiProperty()
    active: boolean;
    @OneToOne(() => Profile)
    @JoinColumn()
    @ApiProperty()
    profile: Profile;
    @Column({ default: new Date().getTime(), type: 'bigint' })
    @ApiProperty()
    create_at: number;
}

export const createAccount = <T extends Record<string, any>>(data: T) => {
    const account = new Account();
    account.tid = data.tid;
    account.email = data.email;
    account.password = data.password;
    account.question = data.question;
    account.active = data.active;
    account.create_at = data.create_at ?? new Date().getTime();
    return account;
};
