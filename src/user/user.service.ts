import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user || null;
  }

  public async createUser(
    email: string,
    hashedPassword: string,
  ): Promise<{ user: User; message: string }> {
    const user = this.userRepo.create({ email, password: hashedPassword });
    await this.userRepo.save(user);
    return { user, message: 'User created successfully' };
  }

  public async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepo.delete(id);
    return { message: 'User deleted successfully' };
  }
}
