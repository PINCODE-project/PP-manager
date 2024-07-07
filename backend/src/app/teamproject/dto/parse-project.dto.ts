import {IsNumber, IsString} from "class-validator";

export class ParseProjectDto {
    @IsString()
    token: string;

    @IsString()
    id: string;

    project: any;
}
