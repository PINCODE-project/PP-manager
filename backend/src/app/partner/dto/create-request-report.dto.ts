import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRequestReportDto {
    @ApiProperty()
    @IsNumber()
    periodId: number;

    @ApiProperty()
    programs: number[];
}
