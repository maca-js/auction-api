import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('active')
  @Auth()
  findActive() {
    return this.categoryService.findActive();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
