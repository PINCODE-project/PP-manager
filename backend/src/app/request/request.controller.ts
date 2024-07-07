import {Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {RequestService} from './request.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('request')
@Controller('request')
export class RequestController {
    constructor(private readonly requestService: RequestService) {
    }

    @Get("/all/:period_id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findAll(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.requestService.findAll({period_id});
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    update(@Param('id', ParseIntPipe) id: number, @Body() updateRequestDto: UpdateRequestDto) {
        return this.requestService.update(id, updateRequestDto);
    }
}
