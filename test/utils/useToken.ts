import { Request } from 'supertest';

export const useToken = (request: Request, token: string) => {
  return request.set('Authorization', `Bearer ${token}`);
};
