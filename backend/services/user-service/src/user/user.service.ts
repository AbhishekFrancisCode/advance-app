import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createProfile(data: CreateUserDto) {
    return this.userRepository.createProfile(data);
  }

  async updateProfile(data: UpdateUserDto) {
    return this.userRepository.updateProfile(data);
  }

  async getUserDataByEmail(data: EmailDto) {
    return this.userRepository.findByEmail(data);
  }
}
