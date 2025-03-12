import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update-password')
  async updatePassword(
    @Body() updateData: { email: string; newPassword: string },
  ): Promise<string> {
    return this.userService.updatePassword(updateData.email, updateData.newPassword);
  }
}