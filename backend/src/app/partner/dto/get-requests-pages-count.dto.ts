import {IsString} from "class-validator";

export class GetRequestsPagesCountDto {
    @IsString()
    token: string;

    @IsString()
    session_cookie: string;

    @IsString()
    semester: string;
}
