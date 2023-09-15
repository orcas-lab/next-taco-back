export const NameSpace = {
    TOKEN: (tid: string) => `TOKEN:${tid}`,
    REFRESH_TOKEN: (tid: string) => `TOKEN:REFRESH_TOKEN:${tid}`,
    REPUTATION: (tid: string) => `REPUTATION:${tid}`,
    NOTICE: (tid: string) => `NOTICE:${tid}`,
    NOTICE_RECORD: () => `NOTICE_RECORD`,
};
