import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePassportProgramDto {
    @ApiProperty()
    @IsNumber()
    passportId: number;

    @ApiProperty()
    @IsNumber()
    programId: number;
}
