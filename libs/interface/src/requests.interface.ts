export type CMD = 'friend:add:sender' | 'group:invite:reciver';
export interface PublicRequest {
    rid: string;
    sender: string;
    reciver: string;
    meta: Record<string, any>;
    sign: string;
    create_at: number;
    update_at: number;
}

export interface InnerRequest extends PublicRequest {
    cmd: CMD;
}
