import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WSExceptionFilter } from 'src/filters/ws-exeption.filter';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { RemoveMessageDto } from 'src/message/dto/remove-emssage.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
// @Auth() // need to check
@UseFilters(new WSExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService) {}

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
    await this.messageService.create(dto);
    client.to(dto.chatId).emit('newMessage', dto);
  }

  @SubscribeMessage('removeMessage')
  handleRemoveMessage(client: Socket, dto: RemoveMessageDto) {
    this.messageService.remove(dto);
    client.to(dto.messageId).emit('removedMessage', dto.messageId);
  }
}
