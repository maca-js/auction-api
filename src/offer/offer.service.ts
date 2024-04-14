import { BadRequestException, Injectable } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PostService } from 'src/post/post.service';
import { PrismaService } from 'src/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    private prisma: PrismaService,
    private postService: PostService,
  ) {}

  async create(dto: CreateOfferDto) {
    const post = await this.postService.findOne(dto.postId);

    if (post.status !== PostStatus.active) {
      return new BadRequestException('Post is not active');
    }

    if (post.currentPrice + post.step > dto.price) {
      return new BadRequestException(
        'Price should be equal or bigger than current price + step',
      );
    }

    if (post.userId === dto.userId) {
      return new BadRequestException(
        "You can't create offer for your own post",
      );
    }

    await this.postService.updateCurrentPrice(dto.postId, {
      currentPrice: dto.price,
    });

    return await this.prisma.offer.create({
      data: dto,
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
