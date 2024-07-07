import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ParsePassportsDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    token?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    session_cookie?: string

    @ApiProperty()
    @IsNumber()
    period_id: number;
}
