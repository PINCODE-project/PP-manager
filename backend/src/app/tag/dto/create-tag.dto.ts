import {IsBoolean, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTagDto {
    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsString()
    color: string;

    @ApiProperty({description: "Является ли тег основным (Трек проекта)"})
    @IsBoolean()
    isTrack: boolean;
}
