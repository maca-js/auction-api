import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(6)
  title: string;

  @IsString()
  @MinLength(12)
  description: string;

  @IsString()
  mainImgUrl: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  startPrice: number;

  @IsString()
  categoryId: string;

  @IsString()
  userId: string;
}
