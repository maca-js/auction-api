import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  chatId: string;
  @IsUUID()
  userId: string;
  @IsNotEmpty()
  text: string;
}
