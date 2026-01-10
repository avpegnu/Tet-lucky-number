import { IsString, IsNotEmpty } from 'class-validator';

export class BankInfoDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}
