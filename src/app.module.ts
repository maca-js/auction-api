import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ChatGateway } from './chat/chat.geteway';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/message.service';
import { OfferModule } from './offer/offer.module';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PostModule,
    CategoryModule,
    OfferModule,
    ChatModule,
    MessageModule,
  ],
  providers: [ChatGateway, MessageService, ChatService, PrismaService],
})
export class AppModule {}
