import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail()
  email: string;
}

export class UserIdDto {
  @IsEmail()
  userId: string;
}
