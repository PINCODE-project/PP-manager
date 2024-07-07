import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class FindOnePassportDto {
    @ApiProperty()
    @IsNumber()
    id: number;
}
