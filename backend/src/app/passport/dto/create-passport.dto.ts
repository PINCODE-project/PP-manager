import {ApiProperty} from "@nestjs/swagger";

export class CreatePassportDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    uid: string;

    @ApiProperty()
    short_name: string;

    @ApiProperty()
    diploma_name: string;

    @ApiProperty()
    team_count: number;

    @ApiProperty()
    students_count: number;

    @ApiProperty()
    request_id: number;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    course: string[];

    @ApiProperty()
    kind: string;

    @ApiProperty()
    status: string;
}
