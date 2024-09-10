import { ApiProperty } from "@nestjs/swagger";

export class CreateProgramDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    uid: string;

    @ApiProperty()
    uuid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    level: string;

    @ApiProperty()
    ugn: number;

    @ApiProperty()
    institute_id: number;

    @ApiProperty()
    institute_name: string;

    @ApiProperty()
    area_id: number;

    @ApiProperty()
    area_uid: string;

    @ApiProperty()
    area_name: string;

    @ApiProperty()
    head_id: number;
}
