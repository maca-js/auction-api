import { IsNumber, IsUUID } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  price: number;
  @IsUUID()
  userId: string;
  @IsUUID()
  postId: string;
}
