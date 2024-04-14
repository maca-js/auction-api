import { Module } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { PrismaService } from 'src/prisma.service';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  controllers: [OfferController],
  providers: [OfferService, PostService, PrismaService],
})
export class OfferModule {}
