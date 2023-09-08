import { ClientProviderOptions, Transport } from '@nestjs/microservices';

const providers: Record<string, ClientProviderOptions> = {
    ACCOUNT_SERVICE: {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'account',
            protoPath: './proto/account.proto',
            url: process.env.ACCOUNT_SERVICE_URL ?? 'localhost:50000',
        },
    },
    BLACKLIST_SERVICE: {
        name: 'BLACKLIST_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'blackList',
            protoPath: './proto/black-list.proto',
            url: process.env.BLACKLIST_SERVICE_URL ?? 'localhost:8000',
        },
    },
    REPUTATION_SERVICE: {
        name: 'REPUTATION_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'reputation',
            protoPath: './proto/repulation.proto',
            url: process.env.REPUTATION_SERVICE_URL ?? 'localhost:6000',
        },
    },
    TOKEN_SERVICE: {
        name: 'TOKEN_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'token',
            protoPath: './proto/token.proto',
            url: process.env.TOKEN_SERVICE_URL ?? 'localhost:7000',
        },
    },
    USER_SERVICE: {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'user',
            protoPath: './proto/user.proto',
            url: process.env.USER_SERVICE_URL ?? 'localhost:7000',
        },
    },
};

export default providers;
