/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { status } from '@grpc/grpc-js';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToRpc();

    const metadata = ctx.getContext(); // ✅ correct

    const token = metadata.get('authorization')?.[0];

    if (!token) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'No token provided',
      });
    }

    try {
      const cleanToken = token.replace('Bearer ', '');

      const decoded = this.jwtService.verify(cleanToken);

      // attach user to context
      ctx.getContext().user = decoded;

      return true;
    } catch {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid or expired token',
      });
    }
  }
}
