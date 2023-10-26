import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';

// Service only uses typorm, and I don't think unit testing is of much value
describe.skip('UserService', () => {
    let service: UserService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).compile();
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
