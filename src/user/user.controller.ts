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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlackList, Profile } from '@app/entity';
import { Response } from 'express';
import { ReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @ApiQuery({ name: 'tid', type: 'string', description: 'taco user id' })
    @ApiResponse({ status: HttpStatus.OK, type: Profile })
    @Get('profile')
    getProfile(@Query('tid') tid: string) {
        return this.userService.getProfile({ tid });
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    @Patch('profile')
    updateProfile(
        @User('tid') tid: string,
        @Body() data: UpdateUserProfileRequest,
    ) {
        return this.userService.updateProfile({ tid, ...data });
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

    @UseGuards(AuthGuard, TargetExistsGuard)
    @ApiBearerAuth()
    @Delete('ban')
    unbanUser(@User('tid') tid: string, @Body() data: UnBan) {
        return this.userService.unban({ ...data, source: tid });
    }

    @Get('avatar/:id')
    async getAvatar(@Param('id') id: string, @Res() response: Response) {
        const data = await this.userService.getAvatar(id);
        if (data instanceof ReadStream) {
            data.pipe(response);
        } else {
            response.redirect(data.url);
        }
    }

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
