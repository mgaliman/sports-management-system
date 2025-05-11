import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  let testUser: { email: string; id: number; password: string; role: string };

  beforeEach(async () => {
    testUser = {
      id: 1,
      email: 'test@email.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
    };

    userService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);
      (userService.createUser as jest.Mock).mockResolvedValue({
        user: testUser,
        message: 'created',
      });

      const result = await service.register({
        email: testUser.email,
        password: 'password123',
      });

      expect(result).toEqual({ user: testUser, message: 'created' });
    });

    it('should throw ConflictException if email exists', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(testUser);

      await expect(
        service.register({ email: testUser.email, password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access_token for valid credentials', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(testUser);

      const result = await service.login({
        email: testUser.email,
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@email.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const wrongPasswordUser = {
        ...testUser,
        password: await bcrypt.hash('wrong', 10),
      };
      (userService.findByEmail as jest.Mock).mockResolvedValue(
        wrongPasswordUser,
      );

      await expect(
        service.login({ email: testUser.email, password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
