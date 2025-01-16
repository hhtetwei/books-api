import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditBooksDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
