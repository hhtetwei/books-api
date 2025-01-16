import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { BooksService } from './books.service';
import { GetUser } from '../auth/decorator';
import { BooksDto, EditBooksDto } from './dto';

@UseGuards(JwtGuard)
@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get()
  getBooks(@GetUser('id') userId: number) {
    return this.bookService.getBooks(userId);
  }

  @Get(':id')
  getBookById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.getBookById(userId, bookId);
  }

  @Post()
  createBook(@GetUser('id') userId: number, @Body() dto: BooksDto) {
    return this.bookService.createBook(userId, dto);
  }

  @Patch(':id')
  editBookById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
    @Body() dto: EditBooksDto,
  ) {
    return this.bookService.editBookById(userId, bookId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.deleteBookById(userId, bookId);
  }
}
