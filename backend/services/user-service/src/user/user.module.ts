import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { GrpcJwtGuard } from 'src/common/guards/grpc-jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ShutdownService } from 'src/common/shutdown.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    GrpcJwtGuard,
    RolesGuard,
    ShutdownService,
  ],
  exports: [JwtModule],
})
export class UserModule {}
