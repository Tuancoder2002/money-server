import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client'; 
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService, private walletService: WalletService) {}

  async createTransaction(walletId: number, amount: number, description: string, transactionType: TransactionType): Promise<string> {
    try {
      await this.prisma.transaction.create({
        data: {
          wallet: { connect: { id: walletId } },
          amount: amount,
          description: description,
          transactionType: transactionType, 
        },
      });
      // Cập nhật số dư của ví
      await this.walletService.updateWalletBalance(walletId, amount, transactionType);

      return 'Transaction created successfully!';
    } catch (error) {
      console.log(error);
      return 'Error creating transaction';
    }
  }

  async getTransactions(walletId: number) {
    try {
      return await this.prisma.transaction.findMany({
        where: { walletId: walletId },
      });
    } catch (error) {
      console.error("Error fetching transactions:", error); // In ra lỗi để kiểm tra
      throw new Error('Error fetching transactions');
    }
  }
}