import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentProjectResultDto } from './create-student-project-result.dto';

export class UpdateStudentProjectResultDto extends PartialType(CreateStudentProjectResultDto) {}
