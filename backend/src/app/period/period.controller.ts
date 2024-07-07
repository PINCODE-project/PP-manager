import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {PeriodService} from './period.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CreatePeriodDto} from './dto/create-period.dto';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('period')
@Controller('period')
export class PeriodController {
    constructor(private readonly periodService: PeriodService) {
    }

    @ApiOperation({summary: "Создание нового семестра"})
    @ApiBearerAuth()
    @Post('')
    @UseGuards(JwtAuthGuard)
    createPeriod(@Body() createPeriodDto: CreatePeriodDto) {
        return this.periodService.create(createPeriodDto);
    }

    @ApiOperation({summary: 'Получение всех семестров'})
    @Get('all')
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.periodService.findAll();
    }
}
