import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto, UserIdDto } from './dto/user-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { GrpcJwtGuard } from 'src/common/guards/grpc-jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { logger } from 'src/common/logger/logger';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @GrpcMethod('UserService', 'CreateUserProfile')
  createProfile(data: CreateUserDto) {
    logger.info({
      msg: 'creating profile',
      email: data.userId,
    });
    return this.userService.createProfile(data);
  }

  @GrpcMethod('UserService', 'UpdateUserProfile')
  @UseGuards(GrpcJwtGuard)
  updateUserProfile(data: UpdateUserDto) {
    logger.info({
      msg: 'updating profile',
      email: data.userId,
    });
    return this.userService.updateProfile(data);
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  @UseGuards(GrpcJwtGuard)
  getProfileByEmail(data: EmailDto) {
    logger.info({
      msg: 'get profile',
      email: data.email, // should not do in production
    });
    return this.userService.getUserDataByEmail(data);
  }

  @GrpcMethod('UserService', 'GetUserById')
  @UseGuards(GrpcJwtGuard)
  getProfileById(data: UserIdDto) {
    logger.info({
      msg: 'get profile',
      email: data.userId,
    });
    return this.userService.getUserDataById(data);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  @UseGuards(GrpcJwtGuard, RolesGuard)
  @Roles('admin')
  deleteUser(data: { userId: string }) {
    logger.info({
      msg: 'delete user level',
      email: data.userId,
    });
    return this.userService.deleteUser(data.userId);
  }
}
