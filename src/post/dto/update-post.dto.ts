import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  // @IsOptional()
  // @IsString()
  // status: RostStatus;
  // @IsOptional()
  // @IsString()
  // winnerId: string;
}

export class UpdatePostCurrentPriceDto {
  @IsNumber()
  currentPrice: number;
}
