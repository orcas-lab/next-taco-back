import { ConfigureModule, ConfigureService } from '@app/configure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { omit } from 'ramda';
import { AccountModule } from './account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigureModule.forRoot('config.toml')],
            inject: [ConfigureService],
            useFactory(service: ConfigureService) {
                const db = service.get('db');
                return {
                    type: 'mysql',
                    ...omit(['synchronize'], db),
                    synchronize:
                        db['synchronize'] === 'auto'
                            ? Boolean(process.env.__DEV__)
                            : (db['synchronize'] as boolean),
                };
            },
        }),
        JwtModule.registerAsync({
            imports: [ConfigureModule.forRoot('config.toml')],
            inject: [ConfigureService],
            async useFactory(configure: ConfigureService) {
                const { expire, publicKeyPath, privateKeyPath } =
                    configure.get('jwt');
                return {
                    signOptions: {
                        expiresIn: expire,
                        algorithm: 'RS256',
                    },
                    publicKey: readFileSync(publicKeyPath),
                    privateKey: readFileSync(privateKeyPath),
                };
            },
        }),
        AccountModule,
    ],
})
export class AppModule {}
