import { Injectable, Logger } from '@nestjs/common';
import {
    BanUser,
    GetUserProfileRequest,
    UnBan,
    UpdateUserProfileRequest,
} from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '@app/entity/profile.entity';
import { Repository } from 'typeorm';
import { BlackList } from '@app/entity/black-list.entity';
import { randomUUID } from 'crypto';
import { ConfigureService } from '@app/configure';
import { ReadStream, createReadStream, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { UserError } from '@app/error';

@Injectable()
export class UserService {
    private logger: Logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(Profile)
        private readonly Profile: Repository<Profile>,
        @InjectRepository(BlackList)
        private readonly BlackList: Repository<BlackList>,
        private readonly config: ConfigureService,
    ) {}
    getProfile(data: GetUserProfileRequest) {
        const { tid } = data;
        return this.Profile.findOne({
            where: {
                tid,
            },
        });
    }
    async updateProfile(data: UpdateUserProfileRequest & { tid: string }) {
        const { tid, nick, description } = data;
        await this.Profile.update({ tid }, { nick, description });
        return;
    }
    banUser(data: BanUser & { source: string }) {
        const { source, target } = data;
        const blackList = new BlackList();
        blackList.id = randomUUID();
        blackList.source = source;
        blackList.target = target;
        blackList.create_at = new Date().getTime();
        blackList.update_at = new Date().getTime();
        return this.BlackList.save(blackList);
    }
    unban(data: UnBan & { source: string }) {
        const { source, target } = data;
        return this.BlackList.delete({
            source,
            target,
        });
    }
    getAvatar(tid: string) {
        const ext = '.png';
        if (this.config.get('asset.avatar.redirect')) {
            let url = `${this.config.get('asset.avatar.redirect')}`;
            if (url.at(-1) === '/') {
                url += tid;
            } else {
                url += '/' + tid;
            }
            url += '.' + ext;
            return {
                url,
            };
        }
        const url = this.config.get('asset.avatar.fs_path');
        const filePath = resolve(url, `${tid}${ext}`);
        return new Promise<ReadStream>((resolve) => {
            if (!existsSync(filePath)) {
                throw UserError.AVATAR_NOT_FOUND;
            }
            resolve(createReadStream(filePath));
        });
    }
    storageAvatar(file: Express.Multer.File, tid: string) {
        const url = this.config.get('asset.avatar.fs_path');
        const filePath = resolve(url, `${tid}.png`);
        writeFileSync(filePath, file.buffer);
        return;
    }
}
