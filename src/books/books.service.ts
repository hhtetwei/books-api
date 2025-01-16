import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BooksDto, EditBooksDto } from './dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  getBooks(userId: number) {
    return this.prisma.book.findMany({
      where: {
        id: userId,
      },
    });
  }

  getBookById(userId: number, bookId: number) {
    return this.prisma.book.findFirst({
      where: {
        id: bookId,
        userId,
      },
    });
  }

  async createBook(userId: number, dto: BooksDto) {
    const book = await this.prisma.book.create({
      data: {
        userId,
        ...dto,
      },
    });
    return book;
  }

  async editBookById(userId: number, bookId: number, dto: EditBooksDto) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book || book.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookById(userId: number, bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book || book.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.book.delete({
      where: {
        id: bookId,
      },
    });
  }
}
