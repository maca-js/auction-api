import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatsDto } from './dto/get-chats.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Auth()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  @Auth()
  findAllByUser(@Body() dto: GetChatsDto) {
    return this.chatService.findAllByUser(dto.id);
  }

  @Get(':id')
  @Auth()
  findById(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
