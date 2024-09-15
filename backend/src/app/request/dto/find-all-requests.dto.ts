import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FindAllRequestsDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;

    @ApiProperty()
    programs: number[];
}
