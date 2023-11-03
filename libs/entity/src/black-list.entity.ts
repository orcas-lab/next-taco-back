import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'BlackList' })
export class BlackList {
    @PrimaryColumn({ type: 'uuid' })
    @ApiProperty()
    id: string;
    @Column()
    @Index()
    @ApiProperty()
    source: string;
    @Column()
    @Index()
    @ApiProperty()
    target: string;
    @Column({ type: 'bigint', default: new Date().getTime() })
    @ApiProperty()
    create_at: number;
    @Column({ type: 'bigint', default: new Date().getTime() })
    @ApiProperty()
    update_at: number;
}
