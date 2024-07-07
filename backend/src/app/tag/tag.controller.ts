import {Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {TagService} from './tag.service';
import {CreateTagDto} from './dto/create-tag.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('tag')
@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {
    }

    @Get('all')
    findAll() {
        return this.tagService.findAll();
    }

    @ApiOperation({summary: "Создание нового тега/трека"})
    @ApiBearerAuth()
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTagDto: CreateTagDto) {
        return this.tagService.create(createTagDto);
    }
}
