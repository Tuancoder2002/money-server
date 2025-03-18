import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, WalletService],
})
export class TransactionModule {}