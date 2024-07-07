import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import {StudentService} from './student.service';
import {CreateStudentDto} from './dto/create-student.dto';
import {UpdateStudentDto} from './dto/update-student.dto';
import {ApiTags} from "@nestjs/swagger";
import {DeleteFromOldProjectDto} from "./dto/delete-from-old-project.dto";

@ApiTags('student')
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {
    }

    @Post()
    create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentService.create(createStudentDto);
    }

    @Get('all/:period_id')
    findAll(@Param('period_id', ParseIntPipe) period_id: number) {
        return this.studentService.findAll({period_id});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.findOne({id});
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateStudentDto: UpdateStudentDto) {
        return this.studentService.update(id, updateStudentDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.remove(id);
    }
}
