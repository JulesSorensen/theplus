import { Test, TestingModule } from '@nestjs/testing';
import { groupsController } from './groups.controller';
import { groupsService } from './groups.service';

describe('groupsController', () => {
  let controller: groupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [groupsController],
      providers: [groupsService],
    }).compile();

    controller = module.get<groupsController>(groupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
