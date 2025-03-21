import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client'; // Import CategoryType từ Prisma Client
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService, private walletService: WalletService) {}

  async createTransaction(walletId: number, amount: number, description: string, categoryId: number): Promise<string> {
    try {
      // Lấy thông tin loại danh mục
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      // Tạo giao dịch
      await this.prisma.transaction.create({
        data: {
          wallet: { connect: { id: walletId } },
          amount: amount,
          description: description,
          category: { connect: { id: categoryId } },
        },
      });

      // Cập nhật số dư của ví
      const balanceChange = category.categoryType === 'INCOME' ? amount : -amount;
      await this.walletService.updateWalletBalance(walletId, balanceChange);

      return 'Transaction created and wallet balance updated successfully!';
    } catch (error) {
      console.log(error);
      return 'Error creating transaction and updating wallet balance';
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

  async getTransactionsWithCategoryTypeForCurrentMonth(walletId: number): Promise<any[]> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          walletId: walletId,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          category: true, // Bao gồm thông tin về danh mục
        },
      });

      return transactions.map(transaction => ({
        name: transaction.category.name,
        categoryType: transaction.category.categoryType,
        amount: transaction.amount,
        description: transaction.description,
      }));
    } catch (error) {
      console.error("Error fetching transactions with category type for current month:", error);
      throw new Error('Error fetching transactions with category type for current month');
    }
  }

  async getTotalExpensesForCurrentMonth(walletId: number): Promise<{ totalExpenses: number }> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    try {
      const totalExpenses = await this.prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          walletId: walletId,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          category: {
            categoryType: 'EXPENSE',
          },
        },
      });

      return { totalExpenses: totalExpenses._sum.amount || 0 };
    } catch (error) {
      console.error("Error calculating total expenses for current month:", error);
      throw new Error('Error calculating total expenses for current month');
    }
  }
}