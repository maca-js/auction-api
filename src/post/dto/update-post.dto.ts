import { PartialType } from '@nestjs/mapped-types';
import { PostStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class UpdatePostCurrentPriceDto {
  @IsNumber()
  currentPrice: number;
}

export class UpdatePostStatusDto {
  @IsEnum(PostStatus)
  status: PostStatus;
}

export class UpdatePostWinnerDto {
  @IsString()
  @IsNotEmpty()
  winnerId: string;
}