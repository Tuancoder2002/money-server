import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Danh sách danh mục mặc định
    const defaultCategories = [
      { name: 'Food', categoryType: CategoryType.EXPENSE, icon: 'https://png.pngtree.com/png-clipart/20240131/original/pngtree-iconbuttonpictogram--eateryrestaurant--dining-photo-png-image_14199886.png' },
      { name: 'Transport', categoryType: CategoryType.EXPENSE, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Circle-icons-plane.svg/768px-Circle-icons-plane.svg.png' },
      { name: 'Health', categoryType: CategoryType.EXPENSE, icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png' },
      { name: 'Entertainment', categoryType: CategoryType.EXPENSE, icon: 'https://cdn-icons-png.flaticon.com/512/6961/6961991.png' },
      { name: 'Shopping', categoryType: CategoryType.EXPENSE, icon: 'https://cdn.pixabay.com/photo/2017/03/29/04/09/shopping-icon-2184065_1280.png' },
      { name: 'Utilities', categoryType: CategoryType.EXPENSE, icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png' },
      { name: 'Education', categoryType: CategoryType.EXPENSE, icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png' },
      { name: 'Travel', categoryType: CategoryType.EXPENSE, icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991108.png' },
      { name: 'Dining Out', categoryType: CategoryType.EXPENSE, icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
      { name: 'Bill', categoryType: CategoryType.EXPENSE, icon: 'https://png.pngtree.com/png-vector/20220825/ourmid/pngtree-paying-bills-rgb-color-icon-gas-literacy-art-vector-png-image_38871094.png' },
      { name: 'Salary', categoryType: CategoryType.INCOME, icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png' },
      { name: 'Bonus', categoryType: CategoryType.INCOME, icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
      { name: 'Freelance', categoryType: CategoryType.INCOME, icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040243.png' },
      { name: 'Investments', categoryType: CategoryType.INCOME, icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040252.png' },
    ];

    // Kiểm tra và tạo danh mục nếu chưa tồn tại
    for (const category of defaultCategories) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name: category.name },
      });

      if (!existingCategory) {
        await this.prisma.category.create({
          data: {
            name: category.name,
            categoryType: category.categoryType,
            icon: category.icon,
          },
        });
      }
    }

    console.log('Default categories initialized.');
  }

  async getAllCategories() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error('Error fetching categories');
    }
  }
}