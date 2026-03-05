import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUserProfile')
  createProfile(data: CreateUserDto) {
    console.log('CreateProfile hit with data:', data);
    return this.userService.createProfile(data);
  }

  @GrpcMethod('UserService', 'UpdateUserProfile')
  updateUserProfile(data: UpdateUserDto) {
    console.log('UpdateProfile hit:', data);
    return this.userService.updateProfile(data);
  }
}
