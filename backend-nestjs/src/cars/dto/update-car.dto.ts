import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCarDTO {
    @IsOptional()
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(50, { message: 'Title can not be longer than 50 characters' })
    title?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'content is required' })
    @IsString({ message: 'content must be string' })
    @MinLength(3, { message: 'content must be at least 3 characters long' })
    @MaxLength(250, { message: 'content can not be longer than 250 characters' })
    description?: string;
}
