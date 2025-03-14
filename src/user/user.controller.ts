import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

interface JwtPayload {
  userId: number; // Hoặc string, tùy thuộc vào cách bạn lưu trữ userId
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me') // Endpoint để lấy thông tin người dùng hiện tại
  async getMe(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header
    console.log('Token:', token);
  
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
  
      // Kiểm tra kiểu của decoded
      if (typeof decoded === 'string' || !('userId' in decoded)) {
        throw new UnauthorizedException('Invalid token payload');
      }
  
      const userId = Number(decoded.userId); // Lấy userId từ token
  
      console.log('Decoded User ID:', userId); // Log userId
  
      if (isNaN(userId)) {
        throw new UnauthorizedException('Invalid user ID');
      }
  
      const user = await this.userService.findUserById(userId); // Gọi service để lấy thông tin người dùng
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      return user; // Trả về thông tin người dùng
    } catch (error) {
      console.error('Error decoding token:', error); // Log lỗi
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post('update-password')
  async updatePassword(
    @Body() updateData: { email: string; newPassword: string },
  ): Promise<string> {
    return this.userService.updatePassword(
      updateData.email,
      updateData.newPassword,
    );
  }
}
