import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LuckyMoneyService } from './lucky-money.service';
import { BankInfoDto } from './dto/bank-info.dto';
import { UserGuard } from '../auth/guards/user.guard';

interface AuthUser {
  userId: string;
  username: string;
  role: string;
}

@Controller('lucky')
@UseGuards(UserGuard)
export class LuckyMoneyController {
  constructor(private readonly luckyMoneyService: LuckyMoneyService) {}

  @Get('config')
  async getConfig(@Request() req: { user: AuthUser }) {
    const userId = req.user.userId;
    return this.luckyMoneyService.getConfig(userId);
  }

  @Post('draw')
  async draw(@Request() req: { user: AuthUser }) {
    const userId = req.user.userId;
    return this.luckyMoneyService.drawLuckyMoney(userId);
  }

  @Post('bank-info')
  async submitBankInfo(
    @Request() req: { user: AuthUser },
    @Body() bankInfoDto: BankInfoDto,
  ) {
    const userId = req.user.userId;
    return this.luckyMoneyService.submitBankInfo(userId, bankInfoDto);
  }

  @Get('status')
  async getStatus(@Request() req: { user: AuthUser }) {
    const userId = req.user.userId;
    return this.luckyMoneyService.getUserStatus(userId);
  }
}
