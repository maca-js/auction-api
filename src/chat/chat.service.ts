import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateChatDto } from './dto/create-chat.dto';

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

    const isChatExist = await this.findOneByUsers([users[0].id, users[1].id]);

    if (isChatExist) {
      throw new BadRequestException('Chat already exist');
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
}
