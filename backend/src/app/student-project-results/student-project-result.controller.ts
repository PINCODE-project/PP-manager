import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentProjectResultService } from './student-project-result.service';
import { CreateStudentProjectResultDto } from './dto/create-student-project-result.dto';
import { UpdateStudentProjectResultDto } from './dto/update-student-project-result.dto';

@Controller('student-project-result')
export class StudentProjectResultController {
  constructor(private readonly studentProjectResultsService: StudentProjectResultService) {}
}
