import { IsUUID } from 'class-validator';

export class GetChatsDto {
  @IsUUID()
  id: string;
}
