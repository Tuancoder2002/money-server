import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token and message on successful login', async () => {
      const result = { token: 'some-token', message: 'Login successful' };
      jest.spyOn(authService, 'loginUser').mockImplementation(async () => result);

      expect(await authController.loginUser({ email: 'test@example.com', password: 'password' })).toBe(result);
    });
  });

  describe('register', () => {
    it('should return a success message on successful registration', async () => {
      const result = 'User registered successfully!';
      jest.spyOn(authService, 'registerUser').mockImplementation(async () => result);

      expect(await authController.registerUser({ email: 'test@example.com', name: 'Test', gender: true, password: 'password' })).toBe(result);
    });
  });
});