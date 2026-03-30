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

  async getRefreshTokenByUserId(sessionId: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        id: sessionId,
      },
    });
  }

  async createRefreshToken(
    userId: string,
    token: string,
    metadata?: {
      device?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    return this.prisma.refreshToken.create({
      data: {
        userId: userId,
        token: token,
        device: metadata?.device,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async updateRefreshToken(sessionId: string, token: string) {
    return this.prisma.refreshToken.update({
      where: {
        id: sessionId,
      },
      data: {
        token: token,
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

  async getUserSessions(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
      },
      orderBy: {
        lastUsedAt: 'desc',
      },
    });
  }

  async revokeSession(sessionId: string) {
    return this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

  async revokeAllSessions(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  async updateLastUsed(sessionId: string) {
    return this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: {}, // triggers @updatedAt
    });
  }

  async getSessionById(sessionId: string) {
    return this.prisma.refreshToken.findUnique({
      where: { id: sessionId },
    });
  }

  //Just for development purpose
  async deleteUser(userId: string) {
    return this.prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
