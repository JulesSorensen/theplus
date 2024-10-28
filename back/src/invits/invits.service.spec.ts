import { Test, TestingModule } from '@nestjs/testing';
import { InvitsService } from './invits.service';

describe('InvitsService', () => {
  let service: InvitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitsService],
    }).compile();

    service = module.get<InvitsService>(InvitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
