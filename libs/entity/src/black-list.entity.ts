import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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
    @Column()
    @CreateDateColumn()
    @ApiProperty()
    create_at: number;
    @Column()
    @UpdateDateColumn()
    @ApiProperty()
    update_at: number;
}
