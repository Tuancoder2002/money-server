import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() userData: { username: string; email: string; password: string }, // Cập nhật ở đây
  ): Promise<string> {
    return this.authService.registerUser(userData);
  }

  @Post('login')
  async loginUser(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ token: string; message: string } | string> {
    return this.authService.loginUser(loginData);
  }
}