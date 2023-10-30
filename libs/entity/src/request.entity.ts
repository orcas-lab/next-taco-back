import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Request {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    uuid: string;
    @Column({ type: 'bigint', generated: 'increment' })
    @Index()
    seq: number;
    @Column({ type: 'int', default: 0 })
    worker_id: number;
    @Column()
    @Index()
    source: string;
    @Column()
    target: string;
    @Column({ type: 'bigint' })
    expire_at: number;
    @Column({ type: 'bigint' })
    create_at: number;
    @Column({ type: 'bigint' })
    update_at: number;
}
