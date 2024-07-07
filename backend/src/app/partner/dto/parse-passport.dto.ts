import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ParsePassportDto {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsString()
    session_cookie: string

    @ApiProperty()
    id?: number;
}
