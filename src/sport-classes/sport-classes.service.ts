import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateSportsClassDto } from './dto/create-sports-class.dto';
import { UpdateSportsClassDto } from './dto/update-sports-class.dto';
import { SportClass } from './entities/sport-class.entity';

@Injectable()
export class SportClassesService {
  constructor(
    @InjectRepository(SportClass)
    private readonly repo: Repository<SportClass>,
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

  public async createSportClass(data: CreateSportsClassDto, createdBy: string) {
    const newClass = this.repo.create({ ...data, createdBy });
    return this.repo.save(newClass);
  }

  public async updateSportClass(id: number, dto: UpdateSportsClassDto) {
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
}
