import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../auth/roles/roles.enum';
import { User } from '../user/entities/user.entity';
import { CreateSportClassDto } from './dto/create-sport-class.dto';
import { UpdateSportClassDto } from './dto/update-sports-class.dto';
import { SportClass } from './entities/sport-class.entity';

@Injectable()
export class SportClassService {
  constructor(
    @InjectRepository(SportClass)
    private readonly sportClassRepo: Repository<SportClass>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async getSportClasses(sport?: string): Promise<SportClass[]> {
    if (sport) {
      const sports = sport.split(',').map((s) => s.trim());
      return this.sportClassRepo.find({
        where: {
          sport: In(sports),
        },
      });
    }

    return this.sportClassRepo.find();
  }

  public async getSportClassById(id: number): Promise<SportClass> {
    const sportClass = await this.sportClassRepo.findOne({ where: { id } });
    if (!sportClass) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }
    return sportClass;
  }

  public async createSportClass(
    data: CreateSportClassDto,
    createdBy: string,
  ): Promise<{ class: SportClass; message: string }> {
    const newClass = this.sportClassRepo.create({ ...data, createdBy });
    await this.sportClassRepo.save(newClass);
    return { class: newClass, message: 'Class created successfully' };
  }

  public async updateSportClass(
    id: number,
    dto: UpdateSportClassDto,
  ): Promise<{ class: SportClass; message: string }> {
    const classToUpdate = await this.sportClassRepo.findOne({ where: { id } });

    if (!classToUpdate) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    Object.assign(classToUpdate, dto);
    await this.sportClassRepo.save(classToUpdate);
    return { class: classToUpdate, message: 'Class updated successfully' };
  }

  public async deleteSportClass(id: number): Promise<{ message: string }> {
    const classToDelete = await this.sportClassRepo.findOne({ where: { id } });

    if (!classToDelete) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    await this.sportClassRepo.remove(classToDelete);
    return { message: 'Class deleted successfully' };
  }

  public async applyUserToSportClass(
    classId: number,
    userId: number,
  ): Promise<{ sportClass: SportClass; message: string }> {
    const sportClass = await this.sportClassRepo.findOne({
      where: { id: classId },
      relations: ['applicants'],
    });

    if (!sportClass) {
      throw new NotFoundException('Class not found');
    }

    const alreadyApplied = sportClass.applicants.some((a) => a.id === userId);
    if (alreadyApplied) {
      throw new BadRequestException('You have already applied for this class');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    sportClass.applicants.push(user);
    return { sportClass, message: 'Application successful' };
  }

  public async getApplicants(classId: number): Promise<{
    applicants: Array<{ id: number; email: string; role: Role }>;
    message: string;
  }> {
    const sportClass = await this.sportClassRepo.findOne({
      where: { id: classId },
      relations: ['applicants'],
    });

    if (!sportClass) {
      throw new NotFoundException('Class not found');
    }

    return {
      applicants: sportClass.applicants.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
      })),
      message: 'Applicants fetched successfully',
    };
  }
}
