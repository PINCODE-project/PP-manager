import {Body, Controller, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {TeamprojectService} from './teamproject.service';
import {ParseTeamprojectDto} from './dto/parse-teamproject.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {CreateReportDto} from "./dto/create-report.dto";

@ApiTags('teamproject')
@Controller('teamproject')
export class TeamprojectController {
    constructor(private readonly teamprojectService: TeamprojectService) {
    }

    @ApiBearerAuth()
    @Post("parse")
    @UseGuards(JwtAuthGuard)
    parse(@Body() parseProjectsDto: ParseTeamprojectDto) {
        return this.teamprojectService.parse(parseProjectsDto);
    }

    @ApiBearerAuth()
    @Post("report")
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    createReport(@Body() createReportDto: CreateReportDto) {
        return this.teamprojectService.createReport(createReportDto);
    }
}
