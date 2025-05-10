import { Test, TestingModule } from '@nestjs/testing';
import { SportClassesService } from './sport-classes.service';

describe('SportClassesService', () => {
  let service: SportClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportClassesService],
    }).compile();

    service = module.get<SportClassesService>(SportClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
