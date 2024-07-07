import {IsString} from "class-validator";

export class GetPassportsPagesCountDto {
    @IsString()
    token: string;

    @IsString()
    session_cookie: string;

    @IsString()
    semester: string;
}
