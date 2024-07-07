import {Controller, Get, Param, ParseIntPipe, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {ProjectService} from './project.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('project')
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }

    @Get('all/:period_id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findAll(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.projectService.findAll({period_id});
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }
}
