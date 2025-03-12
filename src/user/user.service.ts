import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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