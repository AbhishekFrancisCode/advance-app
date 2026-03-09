import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class GrpcJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const metadata = context.switchToRpc().getContext<Metadata>();

    const token = metadata.get('authorization')[0] as string;
    console.log('token grpc', token);

    if (!token) {
      throw new Error('Authorization token missing');
    }

    const payload = this.jwtService.verify<JwtPayload>(token);

    const data = context.switchToRpc().getData<{ user?: JwtPayload }>();
    data.user = payload;

    return true;
  }
}
