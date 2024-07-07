import {IsNumber} from "class-validator";

export class DeleteFromOldProjectDto {
    @IsNumber()
    studentId: number

    @IsNumber()
    periodId: number
}
