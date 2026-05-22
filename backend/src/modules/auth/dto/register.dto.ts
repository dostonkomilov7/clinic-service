import { IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    full_name: string;

    @IsOptional()
    @IsInt()
    age: number;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    phone: string;

    @IsInt()
    telegram_id: number;
}