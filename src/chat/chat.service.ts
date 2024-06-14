import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { RemoveMessageDto } from 'src/chat/dto/remove-message.dto';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  includeUsersAndMessages = {
    users: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    messages: true,
  };

  async create(dto: CreateChatDto) {
    const users = await this.userService.getByIds(dto.users);
    const mappedUsers = users.map((user) => ({ id: user.id }));

    const existingChat = await this.findOneByUsers([users[0].id, users[1].id]);

    if (existingChat) {
      throw new BadRequestException({
        message: `Chat already exist`,
        chatId: existingChat.id,
      });
    }

    return await this.prisma.chat.create({
      data: {
        users: {
          connect: mappedUsers,
        },
      },
    });
  }

  async findOneByUsers(userIds: string[]) {
    if (userIds.length !== 2) {
      throw new Error('Exactly two user IDs are required');
    }

    return await this.prisma.chat.findFirst({
      where: {
        AND: [
          { users: { some: { id: userIds[0] } } },
          { users: { some: { id: userIds[1] } } },
        ],
      },
    });
  }

  async findAllByUser(id: string) {
    return await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: this.includeUsersAndMessages,
    });
  }

  async findById(id: string) {
    return await this.prisma.chat.findUnique({
      where: {
        id,
      },
      include: this.includeUsersAndMessages,
    });
  }

  async remove(id: string) {
    return await this.prisma.chat.delete({
      where: {
        id,
      },
    });
  }

  async isUserCanCreateMessage(chatId: string, userId: string) {
    const chat = await this.findById(chatId);

    if (!chat) {
      throw new BadGatewayException("Chat doesn't exist");
    }

    if (!chat.users.find((user) => user.id === userId)) {
      throw new BadGatewayException("User doesn't exist in current chat");
    }
  }

  async isUserCanRemoveMessage(dto: RemoveMessageDto) {
    const chat = await this.findById(dto.chatId);

    if (!chat) {
      throw new BadGatewayException("Chat doesn't exist");
    }

    const currentMessage = chat.messages.find(
      (message) => message.id === dto.messageId,
    );

    if (!currentMessage) {
      throw new BadGatewayException("Message doesn't exist");
    }

    if (currentMessage.userId !== dto.userId) {
      throw new BadGatewayException('Message not correspond to user');
    }
  }

  async createMessage(dto: CreateMessageDto) {
    await this.isUserCanCreateMessage(dto.chatId, dto.userId);

    return await this.prisma.message.create({
      data: dto,
    });
  }

  async removeMessage(dto: RemoveMessageDto) {
    await this.isUserCanRemoveMessage(dto);

    return await this.prisma.message.delete({
      where: {
        id: dto.messageId,
      },
    });
  }
}
