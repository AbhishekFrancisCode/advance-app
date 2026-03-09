import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; passwordHash: string }) {
    return this.prisma.userAuth.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.userAuth.findUnique({
      where: {
        email,
      },
    });
  }

  async getRefreshTokenByUserId(userId: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.prisma.userAuth.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokens: {
          create: {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        },
      },
    });
  }

  async deleteRefreshTokens(userId: string) {
    return this.prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
