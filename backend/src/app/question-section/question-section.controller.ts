import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionSectionService } from './question-section.service';
import { CreateQuestionSectionDto } from './dto/create-question-section.dto';
import { UpdateQuestionSectionDto } from './dto/update-question-section.dto';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('question-section')
@Controller('question-section')
export class QuestionSectionController {
  constructor(private readonly questionSectionService: QuestionSectionService) {}

  @Post()
  create(@Body() createQuestionSectionDto: CreateQuestionSectionDto) {
    return this.questionSectionService.create(createQuestionSectionDto);
  }

  @Get()
  findAll() {
    return this.questionSectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionSectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionSectionDto: UpdateQuestionSectionDto) {
    return this.questionSectionService.update(+id, updateQuestionSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionSectionService.remove(+id);
  }
}
