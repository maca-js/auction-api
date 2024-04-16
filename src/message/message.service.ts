import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMessageDto) {
    return await this.prisma.message.create({
      data: dto,
    });
  }

  async remove(id: string) {
    return await this.prisma.message.delete({
      where: {
        id,
      },
    });
  }
}
