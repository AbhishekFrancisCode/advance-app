import { Optional } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Optional()
  userAgent?: string;

  @IsString()
  @Optional()
  ipAddress?: string;
}
