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

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @GrpcMethod('UserService', 'CreateUserProfile')
  createProfile(data: CreateUserDto) {
    return this.userService.createProfile(data);
  }

  @GrpcMethod('UserService', 'UpdateUserProfile')
  @UseGuards(GrpcJwtGuard)
  updateUserProfile(data: UpdateUserDto) {
    return this.userService.updateProfile(data);
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  @UseGuards(GrpcJwtGuard)
  getProfileByEmail(data: EmailDto) {
    return this.userService.getUserDataByEmail(data);
  }

  @GrpcMethod('UserService', 'GetUserById')
  @UseGuards(GrpcJwtGuard)
  getProfileById(data: UserIdDto) {
    console.log('userID hit', data);
    return this.userService.getUserDataById(data);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  @UseGuards(GrpcJwtGuard, RolesGuard)
  @Roles('admin')
  deleteUser(data: { userId: string }) {
    return this.userService.deleteUser(data.userId);
  }
}
