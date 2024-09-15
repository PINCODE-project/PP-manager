import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePassportReportDto {
    @ApiProperty()
    @IsNumber()
    periodId: number;

    @ApiProperty()
    programs: number[];
}
