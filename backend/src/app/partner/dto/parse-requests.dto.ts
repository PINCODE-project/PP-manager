import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ParseRequestsDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;
}
