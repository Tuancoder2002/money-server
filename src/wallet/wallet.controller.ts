import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  async createWallet(
    @Body() walletData: { userId: number; name: string },
  ): Promise<string> {
    return this.walletService.createWallet(walletData.userId, walletData.name);
  }

  @Get('user/:userId')
  async getWallets(@Param('userId') userId: string) { // userId là string
    return this.walletService.getWallets(Number(userId)); // Chuyển đổi sang số nguyên
  }
}
