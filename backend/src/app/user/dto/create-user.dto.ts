import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({description: "Логин", example: "CatDev"})
    @IsString()
    login: string;

    @ApiProperty({description: "Имя", example: "Рожков Максим"})
    name: string;

    @ApiProperty({description: "Пароль", example: "P@ssw0rd"})
    @MinLength(6, {message: "Password must be more than 6 symbols"})
    password: string;
}


export class CreateUserResponseDto {
    @ApiProperty({description: "ID созданного пользователя", example: "1bd493a0-8f65-4204-84af-c16184f85342x"})
    userId: string;
}
