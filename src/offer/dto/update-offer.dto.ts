import { IsNumber } from 'class-validator';

export class UpdateOfferDto {
  @IsNumber()
  price: number;
}
