/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { logger } from 'src/common/logger/logger';
import { SessionsResponse } from 'src/auth/dto/session.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Health')
  health(): { status: string } {
    return { status: 'ok' };
  }

  @GrpcMethod('AuthService', 'Register')
  register(data: RegisterDto) {
    logger.info({
      msg: 'processing register',
      email: data.email,
    });
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  login(data: LoginDto) {
    logger.info({
      msg: 'processing login',
      email: data.email,
    });

    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  refresh(data: { refreshToken: string }) {
    return this.authService.refresh(data.refreshToken);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(data: { userId: string }) {
    logger.info({
      msg: 'processing logout',
      userId: data.userId,
    });

    return this.authService.logout(data.userId);
  }

  @GrpcMethod('AuthService', 'GetSessions')
  getSessions(data: { userId: string }): Promise<SessionsResponse> {
    logger.info({
      msg: 'getting sessions',
      userId: data.userId,
    });
    return this.authService.getSessions(data.userId);
  }

  @GrpcMethod('AuthService', 'LogoutSession')
  logoutSession(data: { sessionId: string }) {
    logger.info({
      msg: 'logout sessions',
      sessionId: data.sessionId,
    });
    return this.authService.logoutSession(data.sessionId);
  }

  @GrpcMethod('AuthService', 'LogoutAllSessions')
  logoutAll(data: { userId: string }) {
    return this.authService.logoutAll(data.userId);
  }
}
