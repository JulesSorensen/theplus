import { Test, TestingModule } from "@nestjs/testing";
import { groupsService } from "./groups.service";

describe("groupsService", () => {
  let service: groupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [groupsService],
    }).compile();

    service = module.get<groupsService>(groupsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
