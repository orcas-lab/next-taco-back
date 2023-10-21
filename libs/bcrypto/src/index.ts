import { createHash } from 'crypto';

export const useBCrypt = (msg: string, salt: string, cost = 12) => {
    if (cost === 0) {
        return msg;
    }
    const hash = createHash('sha256');
    const data = hash.update(`${msg}${salt}`).digest('hex');
    return useBCrypt(data.toString(), salt, --cost);
};
