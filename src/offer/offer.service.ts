import { BadRequestException, Injectable } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PostService } from 'src/post/post.service';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    private prisma: PrismaService,
    private postService: PostService,
    private redisService: RedisService,
  ) {}

  async create(dto: CreateOfferDto) {
    const post = await this.postService.findOne(dto.postId);
    const isPostOffers = !!post.offers.length;

    const offerExpiresTime = post.updatedAt;
    offerExpiresTime.setHours(offerExpiresTime.getHours() + 24);

    if (post.status !== PostStatus.active) {
      throw new BadRequestException('Post is not active');
    }

    if (!isPostOffers && post.startPrice > dto.price) {
      throw new BadRequestException(
        'Price should be equal or bigger than start price',
      );
    }

    if (post.userId === dto.userId) {
      throw new BadRequestException("You can't create offer for your own post");
    }

    if (isPostOffers) {
      if (post.currentPrice + post.step > dto.price) {
        throw new BadRequestException(
          'Price should be equal or bigger than current price + step',
        );
      }
      if (post.offers[post.offers.length - 1].userId === dto.userId) {
        throw new BadRequestException("You can't create 2 offers is a row");
      }
    }

    if (post.userId === dto.userId) {
      throw new BadRequestException("You can't create offer for your own post");
    }

    await this.postService.updateCurrentPrice(dto.postId, {
      currentPrice: dto.price,
    });

    await this.redisService.setString(
      dto.postId,
      offerExpiresTime.toString(),
      'post',
    );

    const createdOffer = await this.prisma.offer.create({
      data: dto,
    });

    return await this.getById(createdOffer.id);
  }

  async getById(id: string) {
    return await this.prisma.offer.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getOffersByPost(id: string) {
    return await this.prisma.offer.findMany({
      where: {
        postId: id,
      },
    });
  }

  async getOffersByUser(id: string) {
    return await this.prisma.offer.findMany({
      where: {
        userId: id,
      },
    });
  }

  async update(id: string, dto: UpdateOfferDto) {
    // TODO: add logic user can update only in first 5 min
    return await this.prisma.offer.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    // TODO: add logic user can delete only in first 5 min
    return await this.prisma.offer.delete({
      where: {
        id,
      },
    });
  }
}
