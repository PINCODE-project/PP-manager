import { Body, Controller, Get, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AnalyticService } from "./analytic.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { GetMainAnalyticsDto } from "./dto/get-main-analytics.dto";

@ApiTags("analytic")
@Controller("analytic")
export class AnalyticController {
    constructor(private readonly analyticService: AnalyticService) {}

    @Get("main")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getMainAnalytics(@Body() getMainAnalyticsDto: GetMainAnalyticsDto) {
        return this.analyticService.getMainAnalytics(getMainAnalyticsDto);
    }
}
