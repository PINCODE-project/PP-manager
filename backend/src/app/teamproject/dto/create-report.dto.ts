import {IsNumber} from "class-validator";

export class CreateReportDto {
    @IsNumber()
    periodId: number
}
