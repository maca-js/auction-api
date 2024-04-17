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
// @Auth() // need to check
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

  @SubscribeMessage('createMessage')
  async handleCreateMessage(client: Socket, dto: CreateMessageDto) {
    await this.chatService.createMessage(dto);
    client.to(dto.chatId).emit('newMessage', dto);
  }

  @SubscribeMessage('removeMessage')
  async handleRemoveMessage(client: Socket, dto: RemoveMessageDto) {
    await this.chatService.removeMessage(dto);
    client.to(dto.messageId).emit('removedMessage', dto.messageId);
  }
}
