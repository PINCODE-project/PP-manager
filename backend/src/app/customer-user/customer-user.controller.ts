import {Controller, Get, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CustomerUserService} from "./customer-user.service";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('customer-user')
@Controller('customer-user')
export class CustomerUserController {
    constructor(private readonly customerUserService: CustomerUserService) {
    }

    @Get("/all/:period_id")
    @UseGuards(JwtAuthGuard)
    findAll(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.customerUserService.findAll({period_id});
    }
}
