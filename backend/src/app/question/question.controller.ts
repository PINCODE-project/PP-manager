import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {QuestionService} from './question.service';
import {CreateQuestionDto} from './dto/create-question.dto';
import {UpdateQuestionDto} from './dto/update-question.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('question')
@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    @UsePipes(new ValidationPipe())
    findAll() {
        return this.questionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.update(+id, updateQuestionDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    remove(@Param('id') id: string) {
        return this.questionService.remove(id);
    }
}
