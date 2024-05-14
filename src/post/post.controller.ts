import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/liked')
  @Auth()
  getLiked(@Req() req) {
    return this.postService.getLiked(req.user.id);
  }

  @Get('/user/:userId')
  findByUserId(@Param('userId') id: string) {
    return this.postService.findByUserId(id);
  }

  @Get(':id')
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

  @Patch('like/:id')
  @Auth()
  like(@Param('id') id: string, @Req() req) {
    return this.postService.like(id, req.user.id);
  }

  @Patch('unlike/:id')
  @Auth()
  unlike(@Param('id') id: string, @Req() req) {
    return this.postService.unlike(id, req.user.id);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
