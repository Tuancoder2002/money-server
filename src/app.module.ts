import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module'; 
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [AuthModule, UserModule, WalletModule, TransactionModule],
})
export class AppModule {}