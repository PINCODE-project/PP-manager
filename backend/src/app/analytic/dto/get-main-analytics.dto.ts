import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetMainAnalyticsDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;

    @ApiProperty()
    programs: number[];
}
