import {Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {PassportService} from './passport.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UpdatePassportDto} from "./dto/update-passport.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('passport')
@Controller('passport')
export class PassportController {
    constructor(private readonly passportService: PassportService) {

    }

    @Get("/all/:period_id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findAll(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.passportService.findAll({period_id});
    }

    @Get("/all/for-students/:period_id")
    @UsePipes(new ValidationPipe())
    findAllForStudents(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.passportService.findAllForStudents({period_id});
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.passportService.findOne({id});
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePassportDto: UpdatePassportDto) {
        return this.passportService.update(id, updatePassportDto);
    }
}
