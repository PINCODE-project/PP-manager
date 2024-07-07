import {Controller, Get, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {AnalyticService} from './analytic.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('analytic')
@Controller('analytic')
export class AnalyticController {
    constructor(private readonly analyticService: AnalyticService) {
    }

    @Get("main/:period_id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    getMainAnalytics(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.analyticService.getMainAnalytics({period_id});
    }
}
