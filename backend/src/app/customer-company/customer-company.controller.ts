import {Controller, Get, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {CustomerCompanyService} from './customer-company.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('customer-company')
@Controller('customer-company')
export class CustomerCompanyController {
    constructor(private readonly customerCompanyService: CustomerCompanyService) {
    }

    @Get("/all/:period_id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findAll(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.customerCompanyService.findAll({period_id});
    }
}
