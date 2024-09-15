import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FindAllCustomerCompanyDto {
    @ApiProperty()
    @IsNumber()
    period_id: number;
}
