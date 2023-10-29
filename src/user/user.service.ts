import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Profile)
        private readonly Profile: Repository<Profile>,
        @InjectRepository(BlackList)
        private readonly BlackList: Repository<BlackList>,
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
        const { tid, profile: newProfile } = data;
        await this.Profile.update({ tid }, newProfile);
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
}