import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'BlackList' })
export class BlackList {
    @PrimaryColumn({ type: 'uuid' })
    id: string;
    @Index()
    @Column()
    source: string;
    @Index()
    @Column()
    target: string;
    @Column({ type: 'bigint', default: new Date().getTime() })
    create_at: number;
    @Column({ type: 'bigint', default: new Date().getTime() })
    update_at: number;
}