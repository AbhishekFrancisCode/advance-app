import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto } from './dto/user-profile.dto';
import { RpcException } from '@nestjs/microservices';

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

  async findByEmail(data: EmailDto) {
    console.log('email repo hit', data);
    const user = await this.prisma.userProfile.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      throw new RpcException('User not found');
    }
    console.log('email repo hit user', user);
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      address: user.address,
      dob: user.dob?.toISOString(),
      email: '',
    };
  }

  async updateProfile(data: UpdateUserDto) {
    return await this.prisma.userProfile.update({
      where: { id: data.userId },
      data: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        address: data.address,
        dob: data.dob ? new Date(data.dob) : undefined,
      },
    });
  }
}
