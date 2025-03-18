import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionType } from '@prisma/client'; 

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async createTransaction(
    @Body() transactionData: { walletId: number; amount: number; description: string, transactionType: TransactionType },
  ): Promise<string> {
    return this.transactionService.createTransaction(transactionData.walletId, transactionData.amount, transactionData.description, transactionData.transactionType);
  }

  @Get('wallet/:walletId')
  async getTransactions(@Param('walletId') walletId: string) { // walletId là string
    return this.transactionService.getTransactions(Number(walletId)); // Chuyển đổi sang số nguyên
  }
}