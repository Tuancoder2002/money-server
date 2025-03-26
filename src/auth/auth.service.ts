import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Tạo người dùng mới
      const user = await this.prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        },
      });

      // Thêm các danh mục mặc định
      const defaultCategories = [
        { name: 'Food', categoryType: CategoryType.EXPENSE },
        { name: 'Transport', categoryType: CategoryType.EXPENSE },
        { name: 'Health', categoryType: CategoryType.EXPENSE },
        { name: 'Entertainment', categoryType: CategoryType.EXPENSE },
        { name: 'Shopping', categoryType: CategoryType.EXPENSE }, // Mua sắm
        { name: 'Utilities', categoryType: CategoryType.EXPENSE }, // Tiền điện, nước, internet
        { name: 'Education', categoryType: CategoryType.EXPENSE }, // Học phí
        { name: 'Travel', categoryType: CategoryType.EXPENSE }, // Du lịch
        { name: 'Dining Out', categoryType: CategoryType.EXPENSE }, // Ăn uống bên ngoài
        { name: 'Salary', categoryType: CategoryType.INCOME },
        { name: 'Bill', categoryType: CategoryType.INCOME },
        { name: 'Bonus', categoryType: CategoryType.INCOME }, // Tiền thưởng
        { name: 'Freelance', categoryType: CategoryType.INCOME }, // Thu nhập từ công việc tự do
        { name: 'Investments', categoryType: CategoryType.INCOME }, // Lợi nhuận từ đầu tư
      ];

      for (const category of defaultCategories) {
        await this.prisma.category.create({
          data: {
            name: category.name,
            categoryType: category.categoryType,
          },
        });
      }

      return 'User registered successfully with default categories!';
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
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        return 'User not found';
      }

      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password,
      );
      if (!isPasswordValid) {
        return 'Invalid password';
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      return { token, message: 'Login successful' };
    } catch (error) {
      console.log(error);
      return 'Error during login';
    }
  }
}