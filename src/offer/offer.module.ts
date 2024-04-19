import { Module } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { PrismaService } from 'src/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [RedisModule],
  controllers: [OfferController],
  providers: [OfferService, PostService, PrismaService, RedisService],
})
export class OfferModule {}
