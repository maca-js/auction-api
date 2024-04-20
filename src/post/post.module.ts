import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [RedisModule],
  controllers: [PostController],
  providers: [PostService, PrismaService, RedisService],
})
export class PostModule {}
