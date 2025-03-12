import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(userData: { email: string; name: string; gender: boolean; password: string }): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      return 'User registered successfully!';
    } catch (error) {
      console.log(error);
      return 'Error during registration';
    }
  }

  async loginUser(loginData: { email: string; password: string }): Promise<{ token: string; message: string } | string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        return 'User not found';
      }

      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return 'Invalid password';
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });

      return { token, message: 'Login successful' };
    } catch (error) {
      console.log(error);
      return 'Error during login';
    }
  }
}