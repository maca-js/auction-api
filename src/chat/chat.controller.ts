import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Auth()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  @Auth()
  findAllByUser(@Query('userId') userId: string) {
    return this.chatService.findAllByUser(userId);
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
