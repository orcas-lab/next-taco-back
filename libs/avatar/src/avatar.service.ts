import { Inject, Injectable } from '@nestjs/common';
import { AVATAR_INSTANCE } from './instance';
import { AvatarOption } from './avatar.module';
import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { writeFile } from 'fs';
import { join } from 'path';

@Injectable()
export class AvatarService {
    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;
    constructor(
        @Inject(AVATAR_INSTANCE) private readonly option: AvatarOption,
    ) {
        this.canvas = new Canvas(this.option.width, this.option.height);
        this.ctx = this.canvas.getContext('2d');
    }
    private hashCode(name: string) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            const c = name.charCodeAt(i);
            hash = (hash << 5) - hash + c;
        }
        return Math.abs(hash);
    }
    private randomGetColor(colors: string[], seed: number) {
        return colors[
            ((Math.random() * seed) % (colors.length - 1)).toFixed(0)
        ];
    }
    pixel(
        name: string,
        base_path: string,
        ext: string,
        colors = ['#272D4D', '#B83564', '#FF6A5A', '#FFB350', '#83B8AA'],
        windowSize?: number,
    ) {
        let kernalSize = windowSize;
        if (!kernalSize) {
            let rate = parseInt(`${this.option.width / this.option.height}`);
            while (rate > 90) {
                rate /= 10;
            }
            kernalSize = rate * 10;
        }
        const hashCode = this.hashCode(name);
        for (let i = 0; i <= this.option.width; i += kernalSize) {
            for (let j = 0; j <= this.option.width; j += kernalSize) {
                const color = this.randomGetColor(colors, hashCode);
                this.ctx.fillStyle = color;
                this.ctx.fillRect(i, j, kernalSize, kernalSize);
            }
        }
        const url = join(base_path, `${name}.${ext}`);
        return new Promise<string>((resolve, reject) => {
            writeFile(url, this.canvas.toBuffer(), (err) => {
                if (!err) {
                    resolve(url);
                } else {
                    reject(err);
                }
            });
        });
    }
}
