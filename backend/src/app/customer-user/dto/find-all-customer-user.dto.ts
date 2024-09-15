import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FindAllCustomerUserDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;
}
