import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LuckyMoneyController } from './lucky-money.controller';
import { LuckyMoneyService } from './lucky-money.service';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [LuckyMoneyController],
  providers: [LuckyMoneyService],
})
export class LuckyMoneyModule {}
