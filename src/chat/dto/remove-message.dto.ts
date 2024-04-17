import { IsUUID } from 'class-validator';

export class RemoveMessageDto {
  @IsUUID()
  chatId: string;
  @IsUUID()
  userId: string;
  @IsUUID()
  messageId: string;
}
