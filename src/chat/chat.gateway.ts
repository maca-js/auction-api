import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { RemoveMessageDto } from 'src/chat/dto/remove-message.dto';
import { WSExceptionFilter } from 'src/filters/ws-exception.filter';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WSExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatId: string) {
    client.leave(chatId);
    console.log(`Client ${client.id} left chat ${chatId}`);
  }

  @SubscribeMessage('createMessage')
  async handleCreateMessage(_: Socket, dto: CreateMessageDto) {
    const createdMessage = await this.chatService.createMessage(dto);
    this.server.to(dto.chatId).emit('newMessage', createdMessage);
  }

  @SubscribeMessage('removeMessage')
  async handleRemoveMessage(_: Socket, dto: RemoveMessageDto) {
    await this.chatService.removeMessage(dto);
    this.server.to(dto.chatId).emit('removedMessage', dto.messageId);
  }
}
