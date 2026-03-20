import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtGuard } from './jwt/jwt.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ShutdownService } from 'src/common/shutdown.service';

@Module({
  imports: [
    PrismaModule,
    // JWT Configuration
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), '../../proto/user.proto'),
          // url: 'localhost:50052',
          url: 'user-service:50052', //docker
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtGuard, ShutdownService],
})
export class AuthModule {}
