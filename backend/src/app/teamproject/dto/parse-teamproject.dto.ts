import {IsNumber, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ParseTeamprojectDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    token?: string;

    @ApiProperty()
    @IsNumber()
    period_id: number;
}
