import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(userId: number, name: string, balance: number): Promise<string> {
    try {
      await this.prisma.wallet.create({
        data: {
          userId: userId, 
          name: name,
          balance: balance,
        },
      });
      return 'Wallet created successfully!';
    } catch (error) {
      console.log(error);
      return 'Error creating wallet';
    }
  }

  async getWallets(userId: number) {
    try {
      return await this.prisma.wallet.findMany({
        where: { userId: userId },
      });
    } catch (error) {
      console.error("hello",error); // In ra lỗi để kiểm tra
      throw new Error('Error fetching wallets');
    }
  }

  async updateWalletBalance(walletId: number, amount: number, transactionType: string): Promise<void> {
    try {
      await this.prisma.wallet.update({
        where: { id: walletId },
        data: {
          balance: {
            increment: transactionType === 'DEPOSIT' ? amount : -amount,
          },
        },
      });
    } catch (error) {
      console.error("Error updating wallet balance:", error);
      throw new Error('Error updating wallet balance');
    }
  }
  
}