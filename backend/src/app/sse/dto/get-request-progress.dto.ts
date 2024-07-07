import {IsEnum, IsNumber, IsString} from "class-validator";
import {SSEEnum} from "../interfaces/sse-service.interface";

export class GetRequestProgressDto {
    @IsEnum(SSEEnum)
    event: SSEEnum;
}
