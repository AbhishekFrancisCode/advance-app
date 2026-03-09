/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
    console.log('refresh hit 1', data.refreshToken);
    return this.authService.refresh(data.refreshToken);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(data: { userId: string }) {
    console.log('Delete refresh hit 1', data.userId);
    return this.authService.logout(data.userId);
  }

  @GrpcMethod('AuthService', 'GetSessions')
  getSessions(data: { userId: string }) {
    return this.authService.getSessions(data.userId);
  }

  @GrpcMethod('AuthService', 'LogoutSession')
  logoutSession(data: { sessionId: string }) {
    return this.authService.logoutSession(data.sessionId);
  }
}
