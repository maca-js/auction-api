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
import { CreatePostDto } from './dto/create-post.dto';
import {
  UpdatePostCurrentPriceDto,
  UpdatePostDto,
  UpdatePostStatusDto,
  UpdatePostWinnerDto,
} from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':userId')
  @Auth()
  findByUserId(@Param('userId') id: string) {
    return this.postService.findByUserId(id);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto);
  }

  @Patch('price/:id')
  @Auth()
  updateCurrentPrice(
    @Param('id') id: string,
    @Body() dto: UpdatePostCurrentPriceDto,
  ) {
    return this.postService.updateCurrentPrice(id, dto);
  }

  @Patch('status/:id')
  @Auth()
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePostStatusDto) {
    return this.postService.updateStatus(id, dto);
  }

  @Patch('winner/:id')
  @Auth()
  updateWinner(@Param('id') id: string, @Body() dto: UpdatePostWinnerDto) {
    return this.postService.updateWinner(id, dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}