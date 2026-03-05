/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// import { JwtGuard } from './jwt/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from './jwt/jwt.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  register(data: RegisterDto) {
    console.log('Register hit', data);
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  login(data: LoginDto) {
    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  refresh(data: { refreshToken: string }) {
    return this.authService.refresh(data.refreshToken);
  }

  @GrpcMethod('AuthService', 'UpdateUser')
  @UseGuards(JwtGuard)
  updateUser(data: UpdateUserDto, context: any) {
    const user = context.user;
    console.log('DATA OBJECT:', data);
    console.log('NAME:', data.name);
    console.log('PHONE:', data.phone);
    console.log('USER EMAIL:', user.email);
    return this.authService.updateUser(data, user.email);
  }
}
