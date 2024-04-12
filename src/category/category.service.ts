import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: dto,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({});
  }

  async findActive() {
    return await this.prisma.category.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
