import {IsNumber, IsString} from "class-validator";

export class ParseRequestDto {
    @IsString()
    token: string;

    @IsString()
    session_cookie: string

    @IsNumber()
    id: number;
}
