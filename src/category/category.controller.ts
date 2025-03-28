import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}