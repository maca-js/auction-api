import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { WSExceptionFilter } from 'src/websoket/exeption.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Auth() // need to check
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
  async handleCreateMessage(client: Socket, messageDto: CreateMessageDto) {
    await this.messageService.create(messageDto);
    client.to(messageDto.chatId).emit('newMessage', messageDto);
  }

  @SubscribeMessage('deleteMessage')
  handleDeleteMessage(client: Socket, id: string) {
    this.messageService.remove(id);
    client.to(id).emit('deletedMessage', id);
  }
}
