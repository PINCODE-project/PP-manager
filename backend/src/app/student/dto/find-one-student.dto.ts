import {IsNumber, IsUUID} from "class-validator";

export class FindOneStudentDto {
    @IsNumber()
    id: number;
}
