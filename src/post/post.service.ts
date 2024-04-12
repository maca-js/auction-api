import { Injectable } from '@nestjs/common';
import { RostStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  UpdatePostCurrentPriceDto,
  UpdatePostDto,
} from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreatePostDto) {
    return await this.prisma.post.create({
      data: {
        ...dto,
        currentPrice: dto.startPrice,
        status: RostStatus['active'],
        winnerId: '',
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({});
  }

  async findByUserId(userId: string) {
    return this.prisma.post.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: UpdatePostDto) {
    return await this.prisma.post.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async updateCurrentPrice(id: string, dto: UpdatePostCurrentPriceDto) {
    return await this.prisma.post.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    return await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
