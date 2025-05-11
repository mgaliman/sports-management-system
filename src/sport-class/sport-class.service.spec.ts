import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SportClass } from './entities/sport-class.entity';
import { SportClassService } from './sport-class.service';

describe('SportClassService', () => {
  let service: SportClassService;
  let sportClassRepo: jest.Mocked<Repository<SportClass>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const mockSportClass = {
    id: 1,
    title: 'Test',
    sport: 'Football',
    description: 'Test desc',
    schedule: ['Monday 10:00'],
    duration: 60,
    createdAt: new Date(),
    createdBy: 'admin@email.com',
    applicants: [],
  } as SportClass;

  const mockUser = { id: 10, email: 'user@email.com', role: 'user' } as User;

  beforeEach(async () => {
    sportClassRepo = jest.mocked({
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as Partial<Repository<SportClass>> as Repository<SportClass>);

    userRepo = jest.mocked({
      findOne: jest.fn(),
    } as Partial<Repository<User>> as Repository<User>);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportClassService,
        { provide: getRepositoryToken(SportClass), useValue: sportClassRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<SportClassService>(SportClassService);
  });

  it('should get all classes', async () => {
    sportClassRepo.find.mockResolvedValue([mockSportClass]);
    const result = await service.getSportClasses();
    expect(result).toEqual([mockSportClass]);
  });

  it('should throw if class not found by ID', async () => {
    sportClassRepo.findOne.mockResolvedValue(null);
    await expect(service.getSportClassById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should apply user to class', async () => {
    const classWithNoApplicants = { ...mockSportClass, applicants: [] };
    sportClassRepo.findOne.mockResolvedValueOnce(classWithNoApplicants);
    userRepo.findOne.mockResolvedValue(mockUser);
    sportClassRepo.save.mockResolvedValue({
      ...classWithNoApplicants,
      applicants: [mockUser],
    });

    const result = await service.applyUserToSportClass(1, 10);
    expect(result.message).toBe('Application successful');
  });

  it('should throw if user already applied', async () => {
    const classWithUser = { ...mockSportClass, applicants: [mockUser] };
    sportClassRepo.findOne.mockResolvedValue(classWithUser);
    await expect(service.applyUserToSportClass(1, 10)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if class does not exist during delete', async () => {
    sportClassRepo.findOne.mockResolvedValue(null);
    await expect(service.deleteSportClass(1)).rejects.toThrow(
      NotFoundException,
    );
  });
});
