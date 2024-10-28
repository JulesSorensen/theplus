import { Test, TestingModule } from '@nestjs/testing';
import { InvitsController } from './invits.controller';
import { InvitsService } from './invits.service';

describe('InvitsController', () => {
  let controller: InvitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitsController],
      providers: [InvitsService],
    }).compile();

    controller = module.get<InvitsController>(InvitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
