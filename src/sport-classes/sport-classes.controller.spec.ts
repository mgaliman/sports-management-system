import { Test, TestingModule } from '@nestjs/testing';
import { SportClassesController } from './sport-classes.controller';

describe('SportClassesController', () => {
  let controller: SportClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportClassesController],
    }).compile();

    controller = module.get<SportClassesController>(SportClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
