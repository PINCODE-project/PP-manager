import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRequestProgramDto {
    @ApiProperty()
    @IsNumber()
    requestId: number;

    @ApiProperty()
    @IsNumber()
    programId: number;
}
