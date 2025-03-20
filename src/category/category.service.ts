import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string, categoryType: CategoryType): Promise<string> {
    try {
      await this.prisma.category.create({
        data: {
          name: name,
          categoryType: categoryType, // Sử dụng đúng kiểu dữ liệu CategoryType
        },
      });
      return 'Category created successfully!';
    } catch (error) {
      console.log(error);
      return 'Error creating category';
    }
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