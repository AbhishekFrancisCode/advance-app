import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto, UserIdDto } from './dto/user-profile.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUserProfile')
  createProfile(data: CreateUserDto) {
    return this.userService.createProfile(data);
  }

  @GrpcMethod('UserService', 'UpdateUserProfile')
  updateUserProfile(data: UpdateUserDto) {
    return this.userService.updateProfile(data);
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  getProfileByEmail(data: EmailDto) {
    return this.userService.getUserDataByEmail(data);
  }

  @GrpcMethod('UserService', 'GetUserById')
  getProfileById(data: UserIdDto) {
    console.log('userID hit', data);
    return this.userService.getUserDataById(data);
  }
}
