import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
