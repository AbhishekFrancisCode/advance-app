import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createProfile(data: CreateUserDto) {
    return await this.prisma.userProfile.create({
      data: {
        id: data.userId,
        name: data.name,
        phone: data.phone,
      },
    });
  }

  async findById(userId: string) {
    return await this.prisma.userProfile.findUnique({
      where: { id: userId },
    });
  }

  async updateProfile(data: UpdateUserDto) {
    return await this.prisma.userProfile.update({
      where: { id: data.user_id },
      data: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        address: data.address,
        dob: data.dob,
      },
    });
  }
}
