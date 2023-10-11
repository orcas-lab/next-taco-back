import { ClientProviderOptions, Transport } from '@nestjs/microservices';

const providers = {
    ACCOUNT_SERVICE: {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'account',
            protoPath: './proto/account.proto',
            url: process.env.ACCOUNT_SERVICE_URL ?? '0.0.0.0:5000',
        },
    },
    REPUTATION_SERVICE: {
        name: 'REPUTATION_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'reputation',
            protoPath: './proto/reputation.proto',
            url: process.env.REPUTATION_SERVICE_URL ?? '0.0.0.0:6000',
        },
    },
    TOKEN_SERVICE: {
        name: 'TOKEN_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'token',
            protoPath: './proto/token.proto',
            url: process.env.TOKEN_SERVICE_URL ?? '0.0.0.0:7000',
            loader: {
                keepCase: true,
            },
        },
    },
    BLACKLIST_SERVICE: {
        name: 'BLACKLIST_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'blackList',
            protoPath: './proto/black-list.proto',
            url: process.env.BLACKLIST_SERVICE_URL ?? '0.0.0.0:8000',
        },
    },
    USER_SERVICE: {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'user',
            protoPath: './proto/user.proto',
            url: process.env.USER_SERVICE_URL ?? '0.0.0.0:9000',
        },
    },
    FRIEND_SERVICE: {
        name: 'FRIEND_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'friends',
            protoPath: './proto/friends.proto',
            url: process.env.FRIEND_SERVICE_URL ?? '0.0.0.0:10000',
        },
    },
    NOTICE_SERVICE: {
        name: 'NOTICE_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'notice',
            protoPath: './proto/notice.proto',
            url: process.env.NOTICE_SERVICE_URL ?? '0.0.0.0:11000',
        },
    },
    REQUEST_SERVICE: {
        name: 'REQUEST_SERVICE',
        transport: Transport.GRPC,
        options: {
            package: 'request',
            protoPath: './proto/request.proto',
            url: process.env.REQUEST_SERVICE_URL ?? '0.0.0.0:12000',
        },
    },
};

export default providers as {
    [key in keyof typeof providers]: ClientProviderOptions;
};
