import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  LOVER = 'LOVER',
  FRIEND = 'FRIEND',
  COLLEAGUE = 'COLLEAGUE',
  FAMILY = 'FAMILY',
}

export enum LuckyMoneyStatus {
  NOT_PLAYED = 'NOT_PLAYED',
  PLAYED = 'PLAYED',
}

@Schema({ _id: false })
export class BankInfo {
  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountNumber: string;
}

export const BankInfoSchema = SchemaFactory.createForClass(BankInfo);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, type: String })
  username: string;

  @Prop({ type: String, default: null })
  name: string | null;

  @Prop({ required: true, type: String })
  password: string; // Will be hashed using bcrypt

  @Prop({ required: true, enum: UserRole, type: String })
  role: UserRole;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ required: true, type: [Number] })
  availableAmounts: number[];

  @Prop({
    default: LuckyMoneyStatus.NOT_PLAYED,
    enum: LuckyMoneyStatus,
    type: String,
    required: true, // Re-added required: true as it was in original
  })
  luckyMoneyStatus: LuckyMoneyStatus;

  @Prop({ default: 0, type: Number })
  wonAmount: number;

  @Prop({ type: BankInfo, default: null })
  bankInfo: BankInfo | null;

  @Prop({ type: String, default: null })
  customGreeting: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
