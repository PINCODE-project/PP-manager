import {IsNumber, IsString} from "class-validator";

export class ParseRequestsDto {
    @IsString()
    token: string;

    @IsString()
    session_cookie: string

    @IsNumber()
    period_id: number;
}
