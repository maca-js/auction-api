import { BadGatewayException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  UpdatePostCurrentPriceDto,
  UpdatePostDto,
  UpdatePostStatusDto,
  UpdatePostWinnerDto,
} from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(dto: CreatePostDto) {
    return await this.prisma.post.create({
      data: {
        ...dto,
        currentPrice: dto.startPrice,
        status: PostStatus['active'],
        winnerId: '',
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        likes: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.post.findMany({
      where: {
        userId,
      },
      include: {
        likes: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        offers: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        likes: true,
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

  async updateStatus(id: string, dto: UpdatePostStatusDto) {
    return await this.prisma.post.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async updateWinner(id: string, dto: UpdatePostWinnerDto) {
    return await this.prisma.post.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async findLikeByPostAndUser(postId: string, userId: string) {
    return await this.prisma.postLike.findFirst({
      where: {
        postId,
        userId,
      },
    });
  }

  async like(postId: string, userId: string) {
    const like = await this.findLikeByPostAndUser(postId, userId);

    if (like) {
      throw new BadGatewayException('User already liked this post');
    }

    return await this.prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async unlike(postId: string, userId: string) {
    const like = await this.findLikeByPostAndUser(postId, userId);

    if (!like) {
      throw new BadGatewayException('User is not liked this post');
    }

    return await this.prisma.postLike.delete({
      where: {
        id: like.id,
      },
    });
  }

  async getLiked(userId: string) {
    return await this.prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAuctionExpiry() {
    const keys = await this.redisService.getKeys('post:*');
    console.log('REDIS POSTS KEYS', keys);

    for (const key of keys) {
      const postId = key.split(':')[1];
      const value = await this.redisService.getValue(key);
      const date = new Date(value);
      const now = new Date();

      if (now >= date) {
        const post = await this.findOne(postId);
        await this.updateWinner(postId, {
          winnerId: post.offers[post.offers.length - 1].userId,
        });
        await this.updateStatus(postId, { status: PostStatus.delivery });
        await this.redisService.deleteKey(key);
      }
    }
  }
}
