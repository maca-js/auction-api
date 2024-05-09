import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferService } from './offer.service';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @Auth()
  create(@Body() dto: CreateOfferDto) {
    return this.offerService.create(dto);
  }

  @Get('post/:id')
  @Auth()
  getOffersByPost(@Param('id') id: string) {
    return this.offerService.getOffersByPost(id);
  }

  @Get('user/:id')
  @Auth()
  getOffersByUser(@Param('id') id: string) {
    return this.offerService.getOffersByUser(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.offerService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.offerService.remove(id);
  }
}
