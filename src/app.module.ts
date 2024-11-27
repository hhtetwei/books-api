import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [AuthModule, UserModule, BooksModule],
})
export class AppModule {}
