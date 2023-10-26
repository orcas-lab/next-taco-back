export const namespace = {
    TOKEN: (type?: 'access' | 'refresh', ...args: string[]) =>
        type === null
            ? `TOKEN:${args.join(':')}`
            : `TOKEN:${type}:${args.join(':')}`,
    ACCOUNT: () => `ACCOUNT`,
};
