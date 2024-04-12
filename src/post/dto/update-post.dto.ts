import { PartialType } from '@nestjs/mapped-types';
import { PostStatus } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  // @IsOptional()
  // @IsString()
  // winnerId: string;
}

export class UpdatePostCurrentPriceDto {
  @IsNumber()
  currentPrice: number;
}

export class UpdatePostStatusDto {
  @IsEnum(PostStatus)
  status: PostStatus;
}
