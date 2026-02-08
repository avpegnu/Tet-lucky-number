import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BankInfoDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsOptional()
  @IsString()
  accountName?: string;
}
