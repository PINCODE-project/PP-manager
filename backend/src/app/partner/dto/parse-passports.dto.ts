import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ParsePassportsDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;
}
