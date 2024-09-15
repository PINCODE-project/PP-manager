import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FindPassportsForStudentsDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;
}
