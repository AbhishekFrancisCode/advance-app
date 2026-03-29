/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices/exceptions/rpc-exception';
import { JwtService } from '@nestjs/jwt';
import type { ClientGrpc } from '@nestjs/microservices';

import { firstValueFrom, Observable } from 'rxjs';
import getDeviceType from 'src/utils/device-type';
import { publishUserRegisteredEvent } from 'src/kafka/kafka.producer';
import { createGrpcMetadata } from 'src/common/helper/grpc-client.helper';
import { Metadata } from '@grpc/grpc-js';

interface UserService {
  CreateUserProfile(
    data: {
      userId: string;
      name: string;
      phone?: string;
    },
    metadata: Metadata,
  ): Observable<any>;
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
    // @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
    // await this.kafkaClient.connect();
  }

  async register(dto: RegisterDto) {
    const metadata = createGrpcMetadata();
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
      await firstValueFrom(
        this.userService.CreateUserProfile(
          {
            userId: user.id,
            name: dto.name,
            phone: dto.phone,
          },
          metadata,
        ),
      );
    } catch (err) {
      await this.authRepo.deleteUser(user.id);
      console.log(err);
      throw new RpcException('User profile creation failed');
    }

    try {
      const session = await this.authRepo.createRefreshToken(user.id, '', {
        userAgent: dto.userAgent,
        ipAddress: dto.ipAddress,
        device: getDeviceType(dto.userAgent),
      });

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      const refreshToken = this.jwtService.sign(
        {
          sub: user.id,
          sessionId: session.id,
        },
        { expiresIn: '7d' },
      );

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.authRepo.updateRefreshToken(session.id, hashedRefreshToken);

      // Publish event after successful registration
      await publishUserRegisteredEvent({
        userId: user.id,
        email: dto.email,
        name: dto.name,
      });

      return {
        message: 'User registered successfully',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Registration finalization failed', error);

      throw new RpcException('Registration failed');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findByEmail(dto.email);

    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);

    if (!match) {
      throw new RpcException('Invalid credentials');
    }

    const session = await this.authRepo.createRefreshToken(user.id, '', {
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
      device: getDeviceType(dto.userAgent),
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        sessionId: session.id,
      },
      { expiresIn: '7d' },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.authRepo.updateRefreshToken(session.id, hashedRefreshToken);

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
        decoded.sessionId,
      );
      if (!storedToken) {
        throw new RpcException('Access denied');
      }

      const isMatch = await bcrypt.compare(refreshToken, storedToken.token);
      if (!isMatch) {
        throw new RpcException('Access denied');
      }
      // Rotation
      const newRefreshToken = this.jwtService.sign(
        {
          sub: decoded.sub,
          sessionId: storedToken.id,
        },
        { expiresIn: '7d' },
      );
      const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.authRepo.updateRefreshToken(
        storedToken.id,
        hashedRefreshToken,
      );

      const newAccessToken = this.jwtService.sign(
        {
          sub: decoded.sub,
          email: decoded.email,
        },
        { expiresIn: '15m' },
      );
      await this.authRepo.updateRefreshToken(
        storedToken.id,
        hashedRefreshToken,
      );
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
