import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): Promise<string> {
  //   return this.appService.getHello();
  // }
  @Post('login')
  async loginUser(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ token: string } | string> {
    return this.appService.loginUser(loginData);
  }

  @Post('register')
  async registerUser(
    @Body()
    userData: {
      email: string;
      name: string;
      gender: boolean;
      password: string;
    },
  ): Promise<string> {
    return this.appService.registerUser(userData);
  }
}
