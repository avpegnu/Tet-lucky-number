import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
