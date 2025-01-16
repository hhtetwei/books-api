import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BooksDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
