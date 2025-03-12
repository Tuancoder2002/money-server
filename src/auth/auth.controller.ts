import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ token: string; message: string } | string> {
    return this.authService.loginUser(loginData);
  }

  @Post('register')
  async registerUser(
    @Body() userData: { email: string; name: string; gender: boolean; password: string },
  ): Promise<string> {
    return this.authService.registerUser(userData);
  }
}