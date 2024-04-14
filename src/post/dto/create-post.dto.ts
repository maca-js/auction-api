import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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

  @IsNumber()
  @IsOptional()
  @Min(50)
  step: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  userId: string;
}
