import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async registerUser(userData: {
    email: string;
    name: string;
    gender: boolean;
    password: string;
  }): Promise<string> {
    try {
      console.log('Registering user', userData);

      // Hash the password before saving
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

  async loginUser(loginData: {
    email: string;
    password: string;
  }): Promise<{ token: string; message: string } | string> {
    try {
      console.log('Attempting to find user');
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        console.log('User not found');
        return 'User not found';
      }

      console.log('User found, checking password');
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password,
      );
      if (!isPasswordValid) {
        console.log('Invalid password');
        return 'Invalid password';
      }

      console.log('Password valid, generating token');
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1m',
      });

      console.log('Token generated successfully');
      return { token, message: 'Login successful' };
    } catch (error) {
      console.log('Error during login:', error);
      return 'Error during login';
    }
  }

  async updatePassword(email: string, newPassword: string): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return 'User not found';
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return 'Password updated successfully';
    } catch (error) {
      console.log(error);
      return 'Error updating password';
    }
  }
}
