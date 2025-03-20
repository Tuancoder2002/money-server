import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(@Body() categoryData: { name: string, categoryType: CategoryType }): Promise<string> {
    return this.categoryService.createCategory(categoryData.name, categoryData.categoryType);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}