import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(userId: number, name: string): Promise<string> {
    try {
      await this.prisma.wallet.create({
        data: {
          userId: userId, // Sửa từ user_id thành userId
          name: name,
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
  
}