import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  public async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  public async createUser(
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }
}
