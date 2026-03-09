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
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
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
    } catch {
      throw new RpcException('User profile creation failed');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '60m',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.authRepo.updateRefreshToken(user.id, hashedRefreshToken);

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
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.authRepo.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      message: 'successful',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    console.log('refresh hit 2', refreshToken);
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

      const newAccessToken = this.jwtService.sign(
        { sub: decoded.sub, email: decoded.email },
        { expiresIn: '15m' },
      );

      return {
        message: 'Successful',
        accessToken: newAccessToken,
      };
    } catch {
      throw new RpcException('Refresh token expired. Please login again.');
    }
  }
}
