import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PostModule,
    CategoryModule,
    OfferModule,
  ],
})
export class AppModule {}
