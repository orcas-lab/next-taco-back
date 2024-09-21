import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../user.decorator';
import { AuthGuard } from '@app/shared/auth-guard.guard';
import { BanUser, UnBan, UpdateUserProfileRequest } from './dto/user.dto';
import { TargetExistsGuard } from '@app/shared/target-exists.guard';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BlackList, Profile } from '@app/entity';
import { Response } from 'express';
import { ReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { isEmpty } from 'ramda';
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({
        description: '获取用户的个人信息',
    })
    @ApiQuery({ name: 'tid', type: 'string', description: 'taco user id' })
    @ApiResponse({ status: HttpStatus.OK, type: Profile })
    @Get('profile')
    @UseGuards(AuthGuard)
    getProfile(@Query('tid') tid: string, @User('tid') tokenTid: string) {
        return this.userService.getProfile(
            { tid },
            !tid ? true : tid === tokenTid,
        );
    }

    @ApiOperation({
        description: '修改个人信息',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    @Patch('profile')
    updateProfile(
        @User('tid') tid: string,
        @Body() data: UpdateUserProfileRequest,
    ) {
        if (isEmpty(data)) {
            return {};
        }
        return this.userService.updateProfile({ tid, ...data });
    }

    @ApiOperation({
        description: '将某个用户拉入黑名单',
    })
    @UseGuards(AuthGuard)
    @Get('ban')
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: [BlackList] })
    getBanList(@User('tid') tid: string, @Query('page') page: number) {
        return this.userService.banList(tid, page);
    }
    @UseGuards(AuthGuard, TargetExistsGuard)
    @Post('ban')
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.CREATED, type: BlackList })
    banUser(@User('tid') tid: string, @Body() data: BanUser) {
        return this.userService.banUser({
            ...data,
            source: tid,
        });
    }

    @ApiOperation({
        description: '将某个用户移出黑名单',
    })
    @UseGuards(AuthGuard, TargetExistsGuard)
    @ApiBearerAuth()
    @Delete('ban')
    unbanUser(@User('tid') tid: string, @Body() data: UnBan) {
        return this.userService.unban({ ...data, source: tid });
    }

    @ApiOperation({
        description: '获取某个用户的头像',
    })
    @Get('avatar/:id')
    async getAvatar(@Param('id') id: string, @Res() response: Response) {
        const data = await this.userService.getAvatar(id);
        if (data instanceof ReadStream) {
            data.pipe(response);
        } else {
            response.redirect(data.url);
        }
    }

    @ApiOperation({
        description: '上传头像',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('avatar')
    async putAvatar(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'png',
                })
                .addMaxSizeValidator({
                    maxSize: 1048576,
                    message(maxSize) {
                        return `File size limit: ${maxSize}`;
                    },
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
        @User('tid') tid: string,
    ) {
        this.userService.storageAvatar(file, tid);
        return file.buffer;
    }
}
