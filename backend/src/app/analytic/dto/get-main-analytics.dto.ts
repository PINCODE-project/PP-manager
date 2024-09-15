import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetMainAnalyticsDto {
    @ApiProperty()
    @IsString()
    period_id: number;

    @ApiProperty()
    programs: number[];
}
