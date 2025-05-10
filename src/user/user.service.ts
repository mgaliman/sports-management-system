import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
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

  public async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.repo.delete(id);
    return { message: 'User deleted successfully' };
  }
}
