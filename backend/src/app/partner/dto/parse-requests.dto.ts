import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ParseRequestsDto {
    @IsString()
    @IsOptional()
    token: string;

    @IsString()
    @IsOptional()
    session_cookie: string

    @ApiProperty()
    @IsNumber()
    period_id: number;
}
