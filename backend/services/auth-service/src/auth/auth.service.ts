/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices/exceptions/rpc-exception';
import { JwtService } from '@nestjs/jwt';
import type { ClientGrpc, ClientKafka } from '@nestjs/microservices';

import { firstValueFrom, Observable } from 'rxjs';
import getDeviceType from 'src/utils/device-type';

interface UserService {
  CreateUserProfile(data: {
    userId: string;
    name: string;
    phone?: string;
  }): Observable<any>;
  UpdateUserProfile(data: {
    user_id: string;
    name?: string;
    phone?: string;
    avatar?: string;
    address?: string;
    dob?: string;
  }): Observable<any>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserService;

  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
    @Inject('USER_PACKAGE') private client: ClientGrpc,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
    await this.kafkaClient.connect();
  }

  async register(dto: RegisterDto) {
    console.log('Register hit 1');

    const existing = await this.authRepo.findByEmail(dto.email);

    if (existing) {
      throw new RpcException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.authRepo.createUser({
      email: dto.email,
      passwordHash: hashedPassword,
    });

    try {
      console.log('Register hit 2', user.id, dto.name, dto.phone);
      await firstValueFrom(
        this.userService.CreateUserProfile({
          userId: user.id,
          name: dto.name,
          phone: dto.phone,
        }),
      );
    } catch (err) {
      await this.authRepo.deleteUser(user.id);
      console.log('User profile error:', err);
      throw new RpcException('User profile creation failed');
    }

    try {
      console.log('Register hit 3 Kafka');
      this.kafkaClient.emit('user.created', {
        userId: user.id,
        email: user.email,
        name: dto.name,
        phone: dto.phone,
      });
    } catch (err) {
      console.log(err);
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.authRepo.createRefreshToken(user.id, hashedRefreshToken, {
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
      device: getDeviceType(dto.userAgent),
    });

    return {
      message: 'User registered successfully',
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    console.log('Login hit');

    const user = await this.authRepo.findByEmail(dto.email);

    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);

    if (!match) {
      throw new RpcException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.authRepo.createRefreshToken(user.id, hashedRefreshToken, {
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
      device: getDeviceType(dto.userAgent),
    });

    return {
      message: 'successful',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const storedToken = await this.authRepo.getRefreshTokenByUserId(
        decoded.sub,
      );

      if (!storedToken) {
        throw new RpcException('Access denied');
      }

      const isMatch = await bcrypt.compare(refreshToken, storedToken.token);

      if (!isMatch) {
        throw new RpcException('Access denied');
      }
      // Rotation
      // Delete old TOKEN
      await this.authRepo.deleteRefreshTokens(decoded.sub);

      const payload = {
        sub: decoded.sub,
        email: decoded.email,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await this.authRepo.updateRefreshToken(decoded.sub, hashedRefreshToken);

      return {
        message: 'refreshed',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new RpcException('Refresh token expired. Please login again.');
    }
  }

  async logout(userId: string) {
    await this.authRepo.deleteRefreshTokens(userId);

    return {
      message: 'logged out successfully',
    };
  }

  async getSessions(userId: string) {
    const sessions = await this.authRepo.getUserSessions(userId);

    return {
      sessions: sessions.map((s) => ({
        id: s.id,
        device: s.device ?? '',
        ipAddress: s.ipAddress ?? '',
        createdAt: s.createdAt.toISOString(),
      })),
    };
  }

  async logoutSession(sessionId: string) {
    await this.authRepo.deleteSession(sessionId);

    return {
      message: 'session logged out',
    };
  }
}
