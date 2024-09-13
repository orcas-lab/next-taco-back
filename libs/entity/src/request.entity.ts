import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Request {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    @ApiProperty()
    uuid: string;
    @Column({ type: 'bigint', generated: 'increment' })
    @Index()
    seq: number;
    @Column({ type: 'int', default: 0 })
    worker_id: number;
    @Column()
    @Index()
    @ApiProperty()
    source: string;
    @Column()
    @ApiProperty()
    target: string;
    @Column()
    @ApiProperty()
    expire_at: Date;
    @Column()
    @ApiProperty()
    @CreateDateColumn()
    create_at: Date;
    @Column()
    @ApiProperty()
    @UpdateDateColumn()
    update_at: Date;
    @Column({ type: 'json' })
    meta: Record<string, string>;
    @Column()
    type: string;
}

export class PubReq {
    create_at: Date;
    expire_at: Date;
    source: string;
    target: string;
    uuid: string;
    type: string;
}
