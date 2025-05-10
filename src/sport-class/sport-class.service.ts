import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateSportClassDto } from './dto/create-sport-class.dto';
import { UpdateSportClassDto } from './dto/update-sports-class.dto';
import { SportClass } from './entities/sport-class.entity';

@Injectable()
export class SportClassService {
  constructor(
    @InjectRepository(SportClass)
    private readonly repo: Repository<SportClass>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async getSportClasses(sport?: string) {
    if (sport) {
      const sports = sport.split(',').map((s) => s.trim());
      return this.repo.find({
        where: {
          sport: In(sports),
        },
      });
    }

    return this.repo.find();
  }

  public async getSportClassById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  public async createSportClass(data: CreateSportClassDto, createdBy: string) {
    const newClass = this.repo.create({ ...data, createdBy });
    return this.repo.save(newClass);
  }

  public async updateSportClass(id: number, dto: UpdateSportClassDto) {
    const classToUpdate = await this.repo.findOne({ where: { id } });

    if (!classToUpdate) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    Object.assign(classToUpdate, dto);
    return this.repo.save(classToUpdate);
  }

  public async deleteSportClass(id: number) {
    const classToDelete = await this.repo.findOne({ where: { id } });

    if (!classToDelete) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    return this.repo.remove(classToDelete);
  }

  public async applyUserToSportClass(classId: number, userId: number) {
    const sportClass = await this.repo.findOne({
      where: { id: classId },
      relations: ['applicants'],
    });

    if (!sportClass) {
      throw new NotFoundException('Class not found');
    }

    // Check if user already applied
    const alreadyApplied = sportClass.applicants.some((a) => a.id === userId);
    if (alreadyApplied) {
      console.log('Applicants:', sportClass.applicants);
      console.log('Already applied?', alreadyApplied);
      throw new BadRequestException('You have already applied for this class');
    }

    // Fetch user
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    sportClass.applicants.push(user);
    return { sportClass, message: 'Application successful' };
  }

  public async getApplicants(classId: number) {
    const sportClass = await this.repo.findOne({
      where: { id: classId },
      relations: ['applicants'],
    });

    if (!sportClass) {
      throw new NotFoundException('Class not found');
    }

    return sportClass.applicants.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }));
  }
}
