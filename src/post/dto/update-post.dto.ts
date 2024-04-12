import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  // @IsNumber()
  // @IsOptional()
  // currentPrice: number;
  // @IsOptional()
  // @IsString()
  // status: RostStatus;
  // @IsOptional()
  // @IsString()
  // winnerId: string;
}
