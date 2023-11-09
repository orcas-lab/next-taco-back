import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

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
    @Column({ type: 'bigint' })
    @ApiProperty()
    expire_at: number;
    @Column({ type: 'bigint' })
    @ApiProperty()
    create_at: number;
    @Column({ type: 'bigint' })
    @ApiProperty()
    update_at: number;
}
