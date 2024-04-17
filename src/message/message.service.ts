import { BadGatewayException, Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { RemoveMessageDto } from './dto/remove-emssage.dto';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  async isUserCanCreateMessage(id: string) {
    const chat = await this.chatService.findById(id);

    if (!chat) {
      return new BadGatewayException("Chat doesn't exist");
    }

    if (!chat.users.find((user) => user.id === id)) {
      return new BadGatewayException("User doesn't exist in current chat");
    }
  }

  async isUserCanRemoveMessage(dto: RemoveMessageDto) {
    const chat = await this.chatService.findById(dto.chatId);

    if (!chat) {
      return new BadGatewayException("Chat doesn't exist");
    }

    const currentMessage = chat.messages.find(
      (message) => message.id === dto.messageId,
    );

    if (!currentMessage) {
      return new BadGatewayException("Message doesn't exist");
    }

    if (currentMessage.userId !== dto.userId) {
      return new BadGatewayException('Message not correspond to user');
    }
  }

  async create(dto: CreateMessageDto) {
    await this.isUserCanCreateMessage(dto.chatId);

    return await this.prisma.message.create({
      data: dto,
    });
  }

  async remove(dto: RemoveMessageDto) {
    await this.isUserCanRemoveMessage(dto);

    return await this.prisma.message.delete({
      where: {
        id: dto.messageId,
      },
    });
  }
}
