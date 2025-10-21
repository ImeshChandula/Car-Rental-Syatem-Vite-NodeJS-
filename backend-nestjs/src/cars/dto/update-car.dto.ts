import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCarDTO {
    @IsOptional()
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(50, { message: 'Title can not be longer than 50 characters' })
    title?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be string' })
    @MinLength(3, { message: 'Description must be at least 3 characters long' })
    @MaxLength(250, { message: 'Description can not be longer than 250 characters' })
    description?: string;

    @IsOptional()
    @IsBoolean()
    is_booked?: boolean;

    @IsOptional()
    @IsBoolean()
    is_available?: boolean;
}
