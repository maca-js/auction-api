import { Module } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [MessageModule],
  controllers: [MessageController],
  providers: [MessageService, ChatService, UserService, PrismaService],
})
export class MessageModule {}
