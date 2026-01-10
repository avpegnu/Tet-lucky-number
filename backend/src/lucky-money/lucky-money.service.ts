import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserRole,
  LuckyMoneyStatus,
} from '../schemas/user.schema';
import { BankInfoDto } from './dto/bank-info.dto';

export interface GreetingConfig {
  role: UserRole;
  message: string;
  theme: {
    background: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

@Injectable()
export class LuckyMoneyService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getConfig(userId: string): Promise<GreetingConfig> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const greetingConfigs: Record<UserRole, GreetingConfig> = {
      [UserRole.LOVER]: {
        role: UserRole.LOVER,
        message:
          '💝 Chúc em một năm mới tràn ngập yêu thương và hạnh phúc! Nhận lì xì từ anh nhé! 💕',
        theme: {
          background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
          primaryColor: '#ec4899',
          secondaryColor: '#db2777',
        },
      },
      [UserRole.FRIEND]: {
        role: UserRole.FRIEND,
        message:
          '🎉 Chúc mừng năm mới! Năm nay giàu to, vui vẻ hết nấc! 🥳 Nhận lì xì đi bạn êi!',
        theme: {
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
          primaryColor: '#fb923c',
          secondaryColor: '#ea580c',
        },
      },
      [UserRole.COLLEAGUE]: {
        role: UserRole.COLLEAGUE,
        message:
          '🏮 Kính chúc quý đồng nghiệp một năm mới an khang, thịnh vượng và thành công! 🌟',
        theme: {
          background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
          primaryColor: '#dc2626',
          secondaryColor: '#991b1b',
        },
      },
    };

    return greetingConfigs[user.role];
  }

  async drawLuckyMoney(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.luckyMoneyStatus === LuckyMoneyStatus.PLAYED) {
      throw new BadRequestException('You have already played');
    }

    // Randomly select an amount from availableAmounts
    const randomIndex = Math.floor(
      Math.random() * user.availableAmounts.length,
    );
    const wonAmount = user.availableAmounts[randomIndex];

    // Update user
    user.wonAmount = wonAmount;
    user.luckyMoneyStatus = LuckyMoneyStatus.PLAYED;
    await user.save();

    return {
      wonAmount,
      message: `🎊 Chúc mừng! Bạn đã nhận được ${wonAmount.toLocaleString('vi-VN')} VNĐ!`,
    };
  }

  async submitBankInfo(userId: string, bankInfoDto: BankInfoDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.luckyMoneyStatus !== LuckyMoneyStatus.PLAYED) {
      throw new BadRequestException('You must play the game first');
    }

    user.bankInfo = {
      bankName: bankInfoDto.bankName,
      accountNumber: bankInfoDto.accountNumber,
    };

    await user.save();

    return {
      message: 'Bank information submitted successfully',
      bankInfo: user.bankInfo,
    };
  }

  async getUserStatus(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      username: user.username,
      role: user.role,
      luckyMoneyStatus: user.luckyMoneyStatus,
      wonAmount: user.wonAmount,
      bankInfo: user.bankInfo,
      availableAmounts: user.availableAmounts,
    };
  }
}
