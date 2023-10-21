import { Repository } from 'typeorm';

export type MockRepositoryType<T> = {
    [P in keyof T]?: jest.Mock<any>;
};
export const mockRepository: <T>() => MockRepositoryType<Repository<T>> =
    jest.fn(() => ({
        findOne: jest.fn(),
        save: jest.fn(),
    }));
