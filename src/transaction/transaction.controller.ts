import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async createTransaction(@Body() transactionData: { walletId: number; amount: number; description: string, categoryId: number }): Promise<string> {
    return this.transactionService.createTransaction(
      transactionData.walletId,
      transactionData.amount,
      transactionData.description,
      transactionData.categoryId,
    );
  }

  @Get('wallet/:walletId')
  async getTransactions(@Param('walletId') walletId: string) { // walletId là string
    return this.transactionService.getTransactions(Number(walletId)); // Chuyển đổi sang số nguyên
  }

  @Get('with-category-type/current-month/:walletId')
  async getTransactionsWithCategoryTypeForCurrentMonth(@Param('walletId') walletId: string): Promise<any[]> {
    return this.transactionService.getTransactionsWithCategoryTypeForCurrentMonth(Number(walletId));
  }

  @Get('total-expenses/current-month/:walletId')
  async getTotalExpensesForCurrentMonth(@Param('walletId') walletId: string): Promise<{ totalExpenses: number }> {
    return this.transactionService.getTotalExpensesForCurrentMonth(Number(walletId));
  }
}