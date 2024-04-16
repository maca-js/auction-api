import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [MessageModule],
  controllers: [MessageController],
  providers: [MessageService, PrismaService],
})
export class MessageModule {}
