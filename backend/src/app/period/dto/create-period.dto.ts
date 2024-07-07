import {ApiProperty} from "@nestjs/swagger";

export class CreatePeriodDto {
    @ApiProperty({description: 'Год'})
    year: number;

    @ApiProperty({description: 'Номер семестра'})
    term: number;
}
