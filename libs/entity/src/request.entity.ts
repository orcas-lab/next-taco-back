import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Request {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    uuid: string;
    @Column({ type: 'bigint', generated: 'increment' })
    seq: number;
    @Column({ type: 'int', default: 0 })
    worker_id: number;
    @Column()
    @Index()
    source: string;
    @Column()
    target: string;
    @Column()
    expire_at: number;
    @Column()
    create_at: number;
    @Column()
    update_at: number;
}
