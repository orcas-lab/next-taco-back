import { DynamicModule, Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AVATAR_INSTANCE } from './instance';

export interface AvatarOption {
    width: number;
    height: number;
}

@Module({})
export class AvatarModule {
    static use(option?: AvatarOption): DynamicModule {
        return {
            module: AvatarModule,
            imports: [],
            providers: [
                {
                    provide: AVATAR_INSTANCE,
                    useValue: option,
                },
                AvatarService,
            ],
            exports: [AvatarService],
        };
    }
}
