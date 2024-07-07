import {IsString} from "class-validator";

export class GetMainAnalyticsDto {
    @IsString()
    period_id: number;
}
