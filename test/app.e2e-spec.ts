import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';

import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';
import { BooksDto, EditBooksDto } from 'src/books/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'htet@gmail.com',
      password: '123',
    };
    describe('Sign Up', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
    describe('Login', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
          .inspect();
      });
    });
  });
  describe('User', () => {
    describe('Get Me', () => {
      it('should get the current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          name: 'grace',
          email: 'grace@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Books', () => {
    describe('Get empty books', () => {
      it('should get empty books', () => {
        return pactum
          .spec()
          .get('/books')
          .inspect()
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Book', () => {
      const dto: BooksDto = {
        title: 'IT',
        description: 'A horror thriller',
        author: 'Stephen King',
        price: 55000,
      };
      it('should create book', () => {
        return pactum
          .spec()
          .post('/books')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .inspect()
          .expectStatus(201)
          .stores('bookId', 'id');
      });
    });

    describe('Get books', () => {
      it('should get books', () => {
        return pactum
          .spec()
          .get('/books')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Book By Id', () => {
      it('should get books by id', () => {
        return pactum
          .spec()
          .get('/books/{id}')
          .withPathParams('id', '$S{bookId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .inspect()
          .expectBodyContains('$S{bookId}')
          .expectStatus(200);
      });
    });
    describe('Edit Book', () => {
      const dto: EditBooksDto = {
        title: 'Coraline',
        description: 'A thriller book',
        author: 'Russian',
        price: 6700,
      };
      it('should edit book', () => {
        return pactum
          .spec()
          .patch('/books/{id}')
          .withPathParams('id', '$S{bookId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .inspect()
          .withBody(dto)
          .expectBodyContains('$S{bookId}')
          .expectStatus(200);
      });
    });
    describe('Delete Book By Id', () => {
      it('should delete book', () => {
        return pactum
          .spec()
          .delete('/books/{id}')
          .withPathParams('id', '$S{bookId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty books', () => {
        return pactum
          .spec()
          .get('/books')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
